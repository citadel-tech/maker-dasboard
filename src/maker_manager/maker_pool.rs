use std::collections::HashMap;
use std::str::FromStr;
use std::sync::Arc;
use std::thread::{self, JoinHandle};

use anyhow::{anyhow, Result};
use coinswap::bitcoin::{Address, Amount};
use coinswap::maker::{Maker, TaprootMaker};
use coinswap::utill::UTXO;
use coinswap::wallet::{AddressType, Destination};
use tokio::runtime::Runtime;

use super::message::{MessageRequest, MessageResponse};
use crate::utils::bidirectional_channel::{channel, Requester, Responder};

/// Unique identifier for each maker in the pool
pub type MakerId = String;

/// Wrapper enum to hold either a legacy or taproot maker
pub enum MakerHandle {
    Legacy(Arc<Maker>),
    Taproot(Arc<TaprootMaker>),
}

impl MakerHandle {
    /// Access the wallet via a unified trait-like dispatch
    fn handle_request_sync(&self, request: MessageRequest) -> Result<MessageResponse> {
        match self {
            MakerHandle::Legacy(maker) => handle_legacy_request(maker, request),
            MakerHandle::Taproot(maker) => handle_taproot_request(maker, request),
        }
    }
}

/// Entry representing a single maker running in its own thread
pub struct MakerEntry {
    inner: MakerHandle,
    responder: Responder<MessageRequest, MessageResponse>,
}

impl MakerEntry {
    /// Creates a new MakerEntry and returns the requester handle for communication
    pub fn new(inner: MakerHandle) -> (Self, Requester<MessageRequest, MessageResponse>) {
        let (requester, responder) = channel::<MessageRequest, MessageResponse>(100);
        (Self { inner, responder }, requester)
    }

    /// Starts handling incoming requests in a loop
    pub async fn run(mut self) {
        while let Some(req) = self.responder.recv().await {
            let resp = self
                .inner
                .handle_request_sync(req)
                .unwrap_or_else(|e| MessageResponse::ServerError(e.to_string()));
            if self.responder.send(resp).await.is_err() {
                break;
            }
        }
    }
}

fn handle_legacy_request(maker: &Maker, request: MessageRequest) -> Result<MessageResponse> {
    Ok(match request {
        MessageRequest::Ping => MessageResponse::Pong,
        MessageRequest::Utxo => match maker.get_wallet().read() {
            Ok(wallet) => MessageResponse::UtxoResp {
                utxos: wallet
                    .list_all_utxo_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SwapUtxo => match maker.get_wallet().read() {
            Ok(wallet) => MessageResponse::SwapUtxoResp {
                utxos: wallet
                    .list_incoming_swap_coin_utxo_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::ContractUtxo => match maker.get_wallet().read() {
            Ok(wallet) => MessageResponse::ContractUtxoResp {
                utxos: wallet
                    .list_live_timelock_contract_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::FidelityUtxo => match maker.get_wallet().read() {
            Ok(wallet) => MessageResponse::FidelityUtxoResp {
                utxos: wallet
                    .list_fidelity_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::Balances => match maker.get_wallet().read() {
            Ok(wallet) => match wallet.get_balances() {
                Ok(balances) => MessageResponse::TotalBalanceResp(balances),
                Err(e) => MessageResponse::ServerError(format!("{e:?}")),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::NewAddress => match maker.get_wallet().write() {
            Ok(mut wallet) => match wallet.get_next_external_address(AddressType::P2WPKH) {
                Ok(addr) => MessageResponse::NewAddressResp(addr.to_string()),
                Err(e) => MessageResponse::ServerError(format!("{e:?}")),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SendToAddress {
            address,
            amount,
            feerate,
        } => {
            let amount = Amount::from_sat(amount);
            let outputs = vec![(
                Address::from_str(&address).unwrap().assume_checked(),
                amount,
            )];
            let destination = Destination::Multi {
                outputs,
                op_return_data: None,
                change_address_type: AddressType::P2WPKH,
            };
            let coins_to_send = maker
                .get_wallet()
                .read()
                .unwrap()
                .coin_select(amount, feerate, None)
                .unwrap();
            let tx = maker
                .get_wallet()
                .write()
                .unwrap()
                .spend_from_wallet(feerate, destination, &coins_to_send)
                .unwrap();
            let txid = maker.get_wallet().read().unwrap().send_tx(&tx).unwrap();
            maker.get_wallet().write().unwrap().sync_and_save().unwrap();
            MessageResponse::SendToAddressResp(txid.to_string())
        }
        MessageRequest::GetTorAddress => {
            MessageResponse::ServerError("GetTorAddress not yet implemented".to_string())
        }
        MessageRequest::GetDataDir => {
            let data_dir = maker.get_data_dir();
            MessageResponse::GetDataDirResp(data_dir.to_path_buf())
        }
        MessageRequest::Stop => MessageResponse::Shutdown,
        MessageRequest::ListFidelity => match maker.get_wallet().read() {
            Ok(wallet) => MessageResponse::ListBonds(wallet.display_fidelity_bonds().unwrap()),
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SyncWallet => match maker.get_wallet().write() {
            Ok(mut wallet) => match wallet.sync_and_save() {
                Ok(_) => MessageResponse::Pong,
                Err(e) => MessageResponse::ServerError(e.to_string()),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
    })
}

// ---------- Taproot Maker request handler ----------

fn handle_taproot_request(
    maker: &TaprootMaker,
    request: MessageRequest,
) -> Result<MessageResponse> {
    Ok(match request {
        MessageRequest::Ping => MessageResponse::Pong,
        MessageRequest::Utxo => match maker.wallet().read() {
            Ok(wallet) => MessageResponse::UtxoResp {
                utxos: wallet
                    .list_all_utxo_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SwapUtxo => match maker.wallet().read() {
            Ok(wallet) => MessageResponse::SwapUtxoResp {
                utxos: wallet
                    .list_incoming_swap_coin_utxo_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::ContractUtxo => match maker.wallet().read() {
            Ok(wallet) => MessageResponse::ContractUtxoResp {
                utxos: wallet
                    .list_live_timelock_contract_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::FidelityUtxo => match maker.wallet().read() {
            Ok(wallet) => MessageResponse::FidelityUtxoResp {
                utxos: wallet
                    .list_fidelity_spend_info()
                    .into_iter()
                    .map(UTXO::from_utxo_data)
                    .collect(),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::Balances => match maker.wallet().read() {
            Ok(wallet) => match wallet.get_balances() {
                Ok(balances) => MessageResponse::TotalBalanceResp(balances),
                Err(e) => MessageResponse::ServerError(format!("{e:?}")),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::NewAddress => match maker.wallet().write() {
            Ok(mut wallet) => match wallet.get_next_external_address(AddressType::P2TR) {
                Ok(addr) => MessageResponse::NewAddressResp(addr.to_string()),
                Err(e) => MessageResponse::ServerError(format!("{e:?}")),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SendToAddress {
            address,
            amount,
            feerate,
        } => {
            let amount = Amount::from_sat(amount);
            let outputs = vec![(
                Address::from_str(&address).unwrap().assume_checked(),
                amount,
            )];
            let destination = Destination::Multi {
                outputs,
                op_return_data: None,
                change_address_type: AddressType::P2TR,
            };
            let coins_to_send = maker
                .wallet()
                .read()
                .unwrap()
                .coin_select(amount, feerate, None)
                .unwrap();
            let tx = maker
                .wallet()
                .write()
                .unwrap()
                .spend_from_wallet(feerate, destination, &coins_to_send)
                .unwrap();
            let txid = maker.wallet().read().unwrap().send_tx(&tx).unwrap();
            maker.wallet().write().unwrap().sync_and_save().unwrap();
            MessageResponse::SendToAddressResp(txid.to_string())
        }
        MessageRequest::GetTorAddress => {
            MessageResponse::ServerError("GetTorAddress not yet implemented".to_string())
        }
        MessageRequest::GetDataDir => {
            let data_dir = maker.data_dir();
            MessageResponse::GetDataDirResp(data_dir.to_path_buf())
        }
        MessageRequest::Stop => MessageResponse::Shutdown,
        MessageRequest::ListFidelity => match maker.wallet().read() {
            Ok(wallet) => MessageResponse::ListBonds(wallet.display_fidelity_bonds().unwrap()),
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
        MessageRequest::SyncWallet => match maker.wallet().write() {
            Ok(mut wallet) => match wallet.sync_and_save() {
                Ok(_) => MessageResponse::Pong,
                Err(e) => MessageResponse::ServerError(e.to_string()),
            },
            Err(e) => MessageResponse::ServerError(e.to_string()),
        },
    })
}

/// Internal handle for a running maker thread
struct MakerPoolEntry {
    requester: Requester<MessageRequest, MessageResponse>,
    thread_handle: JoinHandle<()>,
}

/// Pool managing multiple makers, each running in its own thread
pub struct MakerPool {
    makers: HashMap<MakerId, MakerPoolEntry>,
}

impl MakerPool {
    /// Creates a new empty maker pool
    pub fn new() -> Self {
        Self {
            makers: HashMap::new(),
        }
    }

    /// Spawns a new maker in its own thread and registers it in the pool
    pub fn spawn_maker(&mut self, id: MakerId, maker: MakerHandle) -> Result<()> {
        if self.makers.contains_key(&id) {
            return Err(anyhow!("Maker with id '{}' already exists", id));
        }

        let (entry, requester) = MakerEntry::new(maker);

        let thread_handle = thread::spawn(move || {
            let rt = Runtime::new().expect("Failed to create tokio runtime");
            rt.block_on(entry.run());
        });

        self.makers.insert(
            id,
            MakerPoolEntry {
                requester,
                thread_handle,
            },
        );

        Ok(())
    }

    /// Sends a request to a specific maker and returns the response
    pub async fn request(&mut self, id: &MakerId, req: MessageRequest) -> Result<MessageResponse> {
        let handle = self
            .makers
            .get_mut(id)
            .ok_or_else(|| anyhow!("Maker with id '{}' not found", id))?;

        handle.requester.request(req).await
    }

    /// Checks if a maker with the given ID exists in the pool
    pub fn contains(&self, id: &MakerId) -> bool {
        self.makers.contains_key(id)
    }

    /// Returns the number of makers in the pool
    pub fn len(&self) -> usize {
        self.makers.len()
    }

    /// Returns true if the pool is empty
    pub fn is_empty(&self) -> bool {
        self.makers.is_empty()
    }

    /// Returns a list of all maker IDs in the pool
    pub fn list_makers(&self) -> Vec<&MakerId> {
        self.makers.keys().collect()
    }

    /// Removes a maker from the pool (the thread will stop when the channel closes)
    pub fn remove_maker(&mut self, id: &MakerId) -> Option<JoinHandle<()>> {
        self.makers.remove(id).map(|handle| handle.thread_handle)
    }
}

impl Default for MakerPool {
    fn default() -> Self {
        Self::new()
    }
}

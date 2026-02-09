pub mod bidirectional_channel;
pub mod maker_pool;
pub mod message;

use std::path::PathBuf;
use std::sync::Arc;

use anyhow::{anyhow, Result};
use coinswap::maker::Maker;
use maker_pool::{MakerId, MakerPool};
use message::{MessageRequest, MessageResponse};

/// Configuration for creating a new maker
#[derive(Debug, Clone)]
pub struct MakerConfig {
    /// Data directory for the maker
    pub data_dir: PathBuf,
    /// Optional wallet name (defaults to "maker")
    pub wallet_name: Option<String>,

    /// Optional RPC port
    pub rpc_port: Option<u16>,
}

impl Default for MakerConfig {
    fn default() -> Self {
        Self {
            data_dir: PathBuf::from("."),
            wallet_name: None,
            rpc_port: None,
        }
    }
}

/// High-level manager for creating and interacting with makers
pub struct MakerManager {
    pool: MakerPool,
}

impl MakerManager {
    /// Creates a new MakerManager
    pub fn new() -> Self {
        Self {
            pool: MakerPool::new(),
        }
    }

    /// Creates and spawns a new maker with the given configuration
    pub fn create_maker(&mut self, _id: MakerId, _config: MakerConfig) -> Result<()> {
        todo!("initalize maker");
    }

    /// Spawns an existing maker instance
    pub fn spawn_existing_maker(&mut self, id: MakerId, maker: Arc<Maker>) -> Result<()> {
        self.pool.spawn_maker(id, maker)
    }

    /// Sends a ping to a maker to check connectivity
    pub async fn ping(&mut self, id: &MakerId) -> Result<()> {
        match self.pool.request(id, MessageRequest::Ping).await? {
            MessageResponse::Pong => Ok(()),
            MessageResponse::ServerError(e) => Err(anyhow!(e)),
            _ => Err(anyhow!("Unexpected response")),
        }
    }

    /// Gets all UTXOs from a maker's wallet
    pub async fn get_utxos(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::Utxo).await
    }

    /// Gets swap UTXOs from a maker's wallet
    pub async fn get_swap_utxos(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::SwapUtxo).await
    }

    /// Gets contract UTXOs from a maker's wallet
    pub async fn get_contract_utxos(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::ContractUtxo).await
    }

    /// Gets fidelity UTXOs from a maker's wallet
    pub async fn get_fidelity_utxos(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::FidelityUtxo).await
    }

    /// Gets the balances from a maker's wallet
    pub async fn get_balances(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::Balances).await
    }

    /// Generates a new address from a maker's wallet
    pub async fn get_new_address(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::NewAddress).await
    }

    /// Sends funds to an address from a maker's wallet
    pub async fn send_to_address(
        &mut self,
        id: &MakerId,
        address: String,
        amount: u64,
        feerate: f64,
    ) -> Result<MessageResponse> {
        self.pool
            .request(
                id,
                MessageRequest::SendToAddress {
                    address,
                    amount,
                    feerate,
                },
            )
            .await
    }

    /// Gets the Tor address of a maker
    pub async fn get_tor_address(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::GetTorAddress).await
    }

    /// Gets the data directory of a maker
    pub async fn get_data_dir(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::GetDataDir).await
    }

    /// Lists fidelity bonds of a maker
    pub async fn list_fidelity(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::ListFidelity).await
    }

    /// Syncs a maker's wallet with the blockchain
    pub async fn sync_wallet(&mut self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::SyncWallet).await
    }

    /// Sends a raw request to a maker
    pub async fn request(&mut self, id: &MakerId, req: MessageRequest) -> Result<MessageResponse> {
        self.pool.request(id, req).await
    }

    /// Checks if a maker exists in the pool
    pub fn has_maker(&self, id: &MakerId) -> bool {
        self.pool.contains(id)
    }

    /// Returns the number of makers in the pool
    pub fn maker_count(&self) -> usize {
        self.pool.len()
    }

    /// Returns a list of all maker IDs
    pub fn list_makers(&self) -> Vec<&MakerId> {
        self.pool.list_makers()
    }

    /// Removes a maker from the pool
    pub fn remove_maker(&mut self, id: &MakerId) -> bool {
        self.pool.remove_maker(id).is_some()
    }
}

impl Default for MakerManager {
    fn default() -> Self {
        Self::new()
    }
}

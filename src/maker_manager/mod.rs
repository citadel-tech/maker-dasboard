pub mod maker_pool;
pub mod message;

use std::path::PathBuf;
use std::sync::Arc;

use anyhow::{anyhow, Result};
use coinswap::bitcoind::bitcoincore_rpc::Auth;
use coinswap::maker::{Maker, MakerBehavior, TaprootMaker};
use coinswap::wallet::RPCConfig;
use maker_pool::{MakerHandle as MakerInner, MakerId, MakerPool};
use message::{MessageRequest, MessageResponse};

/// Configuration for creating a new maker
#[derive(Debug, Clone)]
pub struct MakerConfig {
    /// Optional data directory. Default: "~/.coinswap/maker"
    pub data_directory: Option<PathBuf>,
    /// Bitcoin Core RPC network address (e.g. "127.0.0.1:38332")
    pub rpc: String,
    /// Bitcoin Core ZMQ address (e.g. "tcp://127.0.0.1:28332")
    pub zmq: String,
    /// Bitcoin Core RPC authentication (username, password).
    /// Must be explicitly provided — no default credentials are assumed.
    pub auth: Option<(String, String)>,
    /// Optional Tor authentication string
    pub tor_auth: Option<String>,
    /// Optional wallet name
    pub wallet_name: Option<String>,
    /// Use experimental Taproot-based coinswap protocol
    pub taproot: bool,
    /// Optional password for wallet encryption
    pub password: Option<String>,
}

impl Default for MakerConfig {
    fn default() -> Self {
        Self {
            data_directory: None,
            rpc: "127.0.0.1:38332".to_string(),
            zmq: "tcp://127.0.0.1:28332".to_string(),
            auth: None,
            tor_auth: None,
            wallet_name: None,
            taproot: false,
            password: None,
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
    pub fn create_maker(&mut self, id: MakerId, config: MakerConfig) -> Result<()> {
        let (user, pass) = config.auth.ok_or_else(|| {
            anyhow!("RPC authentication credentials must be provided in MakerConfig.auth")
        })?;

        let rpc_config = RPCConfig {
            url: config.rpc,
            auth: Auth::UserPass(user, pass),
            wallet_name: config
                .wallet_name
                .clone()
                .unwrap_or_else(|| "random".to_string()),
        };

        if config.taproot {
            let maker = Arc::new(
                TaprootMaker::init(
                    config.data_directory,
                    config.wallet_name,
                    Some(rpc_config),
                    None,
                    None,
                    None,
                    config.tor_auth,
                    None,
                    config.zmq,
                    config.password,
                )
                .map_err(|e| anyhow!("Failed to initialize taproot maker: {:?}", e))?,
            );
            self.pool.spawn_maker(id, MakerInner::Taproot(maker))
        } else {
            let maker = Arc::new(
                Maker::init(
                    config.data_directory,
                    config.wallet_name,
                    Some(rpc_config),
                    None,
                    None,
                    None,
                    config.tor_auth,
                    None,
                    MakerBehavior::Normal,
                    config.zmq,
                    config.password,
                )
                .map_err(|e| anyhow!("Failed to initialize maker: {:?}", e))?,
            );
            self.pool.spawn_maker(id, MakerInner::Legacy(maker))
        }
    }

    /// Spawns an existing regular maker instance
    pub fn spawn_existing_maker(&mut self, id: MakerId, maker: Arc<Maker>) -> Result<()> {
        self.pool.spawn_maker(id, MakerInner::Legacy(maker))
    }

    /// Spawns an existing taproot maker instance
    pub fn spawn_existing_taproot_maker(
        &mut self,
        id: MakerId,
        maker: Arc<TaprootMaker>,
    ) -> Result<()> {
        self.pool.spawn_maker(id, MakerInner::Taproot(maker))
    }

    /// Sends a ping to a maker to check connectivity
    pub async fn ping(&self, id: &MakerId) -> Result<()> {
        match self.pool.request(id, MessageRequest::Ping).await? {
            MessageResponse::Pong => Ok(()),
            MessageResponse::ServerError(e) => Err(anyhow!(e)),
            _ => Err(anyhow!("Unexpected response")),
        }
    }

    /// Gets all UTXOs from a maker's wallet
    pub async fn get_utxos(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::Utxo).await
    }

    /// Gets swap UTXOs from a maker's wallet
    pub async fn get_swap_utxos(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::SwapUtxo).await
    }

    /// Gets contract UTXOs from a maker's wallet
    pub async fn get_contract_utxos(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::ContractUtxo).await
    }

    /// Gets fidelity UTXOs from a maker's wallet
    pub async fn get_fidelity_utxos(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::FidelityUtxo).await
    }

    /// Gets the balances from a maker's wallet
    pub async fn get_balances(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::Balances).await
    }

    /// Generates a new address from a maker's wallet
    pub async fn get_new_address(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::NewAddress).await
    }

    /// Sends funds to an address from a maker's wallet
    pub async fn send_to_address(
        &self,
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
    pub async fn get_tor_address(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::GetTorAddress).await
    }

    /// Gets the data directory of a maker
    pub async fn get_data_dir(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::GetDataDir).await
    }

    /// Lists fidelity bonds of a maker
    pub async fn list_fidelity(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::ListFidelity).await
    }

    /// Syncs a maker's wallet with the blockchain
    pub async fn sync_wallet(&self, id: &MakerId) -> Result<MessageResponse> {
        self.pool.request(id, MessageRequest::SyncWallet).await
    }

    /// Sends a raw request to a maker
    pub async fn request(&self, id: &MakerId, req: MessageRequest) -> Result<MessageResponse> {
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

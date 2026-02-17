import { useState } from "react";

export default function MakerSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRpcPassword, setShowRpcPassword] = useState(false);
  const [testingBitcoin, setTestingBitcoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zmqEndpoint, setZmqEndpoint] = useState("tcp://127.0.0.1:28332");
  const [bitcoinStatus, setBitcoinStatus] = useState({
    connected: false,
    version: "--",
    network: "--",
    blockHeight: "--",
    syncProgress: "--",
  });

  const testBitcoinConnection = async () => {
    setTestingBitcoin(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBitcoinStatus({
        connected: true,
        version: "/Satoshi:26.0.0/",
        network: "regtest",
        blockHeight: "276",
        syncProgress: "100.0%",
      });
    } catch {
      setBitcoinStatus({
        connected: false,
        version: "--",
        network: "--",
        blockHeight: "--",
        syncProgress: "--",
      });
    }
    setTestingBitcoin(false);
  };

  const copyZmqConfig = () => {
    const text = `zmqpubrawblock=${zmqEndpoint}\nzmqpubrawtx=${zmqEndpoint}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Network Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Network Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Network Port
            </label>
            <input
              type="number"
              defaultValue="6102"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Port for client connections
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">RPC Port</label>
            <input
              type="number"
              defaultValue="6103"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Port for maker-cli operations
            </p>
          </div>
        </div>
      </div>

      {/* Tor Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Tor Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              SOCKS Port
            </label>
            <input
              type="number"
              defaultValue="9052"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Socks port for Tor proxy
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Control Port
            </label>
            <input
              type="number"
              defaultValue="9051"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Control port for Tor interface
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Tor Auth Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="tor-password"
                placeholder="Optional"
                className="w-full px-4 py-2.5 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Authentication password for Tor
            </p>
          </div>
        </div>
      </div>

      {/* Bitcoin Core RPC Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">
          Bitcoin Core RPC Configuration
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Settings */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-white">
              Connection Settings
            </h4>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                RPC Host
              </label>
              <input
                type="text"
                defaultValue="127.0.0.1"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bitcoin Core RPC host address
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                RPC Port
              </label>
              <input
                type="number"
                defaultValue="38332"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                8332 mainnet, 18332 testnet, 18443 regtest, 38332 signet
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                RPC Username
              </label>
              <input
                type="text"
                defaultValue="user"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                RPC username from bitcoin.conf
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                RPC Password
              </label>
              <div className="relative">
                <input
                  type={showRpcPassword ? "text" : "password"}
                  placeholder="Enter RPC password"
                  className="w-full px-4 py-2.5 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowRpcPassword(!showRpcPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors"
                >
                  {showRpcPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                RPC password from bitcoin.conf
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-white">
              Connection Status
            </h4>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      bitcoinStatus.connected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-400">
                    Connection Status
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    bitcoinStatus.connected ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {bitcoinStatus.connected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bitcoin Version</span>
                  <span className="text-gray-300">{bitcoinStatus.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className="text-gray-300">{bitcoinStatus.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Block Height</span>
                  <span className="text-gray-300">
                    {bitcoinStatus.blockHeight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sync Progress</span>
                  <span className="text-gray-300">
                    {bitcoinStatus.syncProgress}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={testBitcoinConnection}
                disabled={testingBitcoin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {testingBitcoin ? "Testing..." : "Test Connection"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ZMQ Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">ZMQ Configuration</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-base font-medium text-white">ZMQ Endpoint</h4>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                ZMQ Endpoint (Raw Block & Transaction)
              </label>
              <input
                type="text"
                value={zmqEndpoint}
                onChange={(e) => setZmqEndpoint(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                ZMQ endpoint used for both raw block and transaction
                notifications
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-3">
              <p className="text-xs text-yellow-400">
                ⚠️ <strong>Note:</strong> Both zmqpubrawblock and zmqpubrawtx
                should use the same endpoint (28332).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium text-white">
              Bitcoin.conf Setup
            </h4>

            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4">
              <p className="text-xs text-yellow-400 mb-2">
                ⚠️ <strong>ZMQ Required:</strong> Bitcoin Core must have ZMQ
                enabled for real-time notifications.
              </p>
              <p className="text-xs text-gray-400">
                Add these lines to your bitcoin.conf:
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 font-mono text-xs text-gray-300">
              zmqpubrawblock={zmqEndpoint}
              <br />
              zmqpubrawtx={zmqEndpoint}
            </div>

            <button
              onClick={copyZmqConfig}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-all"
            >
              {copied ? "✓ Copied!" : "Copy ZMQ Config"}
            </button>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
              <p className="text-xs text-blue-400">
                💡 After adding ZMQ config, restart Bitcoin Core for changes to
                take effect.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Swap Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Minimum Swap Amount (sats)
            </label>
            <input
              type="number"
              defaultValue="10000"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum amount in satoshis that can be swapped
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Base Fee (sats)
            </label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Fixed base fee charged for services
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Amount Relative Fee (%)
            </label>
            <input
              type="number"
              step="0.01"
              defaultValue="0.1"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Percentage fee based on swap amount
            </p>
          </div>
        </div>
      </div>

      {/* Fidelity Bond Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">
          Fidelity Bond Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Fidelity Amount (sats)
            </label>
            <input
              type="number"
              defaultValue="50000"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Fidelity Bond amount in satoshis
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Fidelity Timelock (blocks)
            </label>
            <input
              type="number"
              defaultValue="13104"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Relative timelock in number of blocks
            </p>
          </div>
        </div>
      </div>

      {/* Save and Restart */}
      <div className="flex gap-3">
        <button className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold">
          Save & Restart Maker
        </button>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <p className="text-xs text-blue-400">
          💡 <strong>Note:</strong> Saving will update the config.toml file and
          restart this maker for changes to take effect.
        </p>
      </div>
    </div>
  );
}

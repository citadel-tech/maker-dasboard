import Nav from "../components/Nav";
import { useState, useEffect } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Tor Configuration
    torControlPort: "9051",
    torSocksPort: "9050",
    torAuthPassword: "",

    // Bitcoin RPC
    rpcHost: "127.0.0.1",
    rpcPort: "18443",
    rpcUsername: "user",
    rpcPassword: "",

    // ZMQ
    zmqRawBlock: "tcp://127.0.0.1:28332",
    zmqRawTx: "tcp://127.0.0.1:28332",
  });

  const [testingBitcoin, setTestingBitcoin] = useState(false);
  const [testingTor, setTestingTor] = useState(false);
  const [bitcoinStatus, setBitcoinStatus] = useState({
    connected: false,
    version: "--",
    network: "--",
    blockHeight: "--",
    syncProgress: "--",
  });
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("makerSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("makerSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testBitcoinConnection = async () => {
    setTestingBitcoin(true);

    try {
      // TODO: Implement actual RPC test
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful connection
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

  const testTorConnection = async () => {
    setTestingTor(true);

    try {
      // TODO: Implement actual Tor test
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("✅ Tor connection successful!");
    } catch {
      alert("❌ Tor connection failed");
    }

    setTestingTor(false);
  };

  const handleConnect = async () => {
    await testBitcoinConnection();
  };

  const handleDisconnect = () => {
    setBitcoinStatus({
      connected: false,
      version: "--",
      network: "--",
      blockHeight: "--",
      syncProgress: "--",
    });
  };

  const copyZmqConfig = () => {
    const text = `zmqpubrawblock=${settings.zmqRawBlock}\nzmqpubrawtx=${settings.zmqRawTx}`;
    navigator.clipboard.writeText(text);
    alert("✓ Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Configure your maker dashboard and Bitcoin Core connection
          </p>
        </div>

        <div className="space-y-6">
          {/* Tor Configuration */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tor Configuration</h3>
              <button
                onClick={testTorConnection}
                disabled={testingTor}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-orange-500 transition-all text-sm font-medium disabled:opacity-50"
              >
                {testingTor ? "Testing..." : "🔌 Test Tor"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Control Port
                </label>
                <input
                  type="number"
                  name="torControlPort"
                  value={settings.torControlPort}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Control port for Tor interface
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  SOCKS Port
                </label>
                <input
                  type="number"
                  name="torSocksPort"
                  value={settings.torSocksPort}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  SOCKS port for Tor proxy
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tor Auth Password
                </label>
                <input
                  type="password"
                  name="torAuthPassword"
                  value={settings.torAuthPassword}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Authentication password
                </p>
              </div>
            </div>

            <div className="mt-4 bg-purple-900/20 border border-purple-800/30 rounded-lg p-3">
              <p className="text-xs text-purple-400">
                🧅 <strong>Tor Network:</strong> Coinswap uses Tor for private
                maker discovery and communication. Make sure Tor is running.
              </p>
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
                    name="rpcHost"
                    value={settings.rpcHost}
                    onChange={handleChange}
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
                    name="rpcPort"
                    value={settings.rpcPort}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    8332 mainnet, 18332 testnet, 18443 regtest
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    RPC Username
                  </label>
                  <input
                    type="text"
                    name="rpcUsername"
                    value={settings.rpcUsername}
                    onChange={handleChange}
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
                  <input
                    type="password"
                    name="rpcPassword"
                    value={settings.rpcPassword}
                    onChange={handleChange}
                    placeholder="Enter RPC password"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100"
                  />
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
                        className={`w-3 h-3 rounded-full mr-2 ${bitcoinStatus.connected ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span className="text-sm text-gray-400">
                        Connection Status
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${bitcoinStatus.connected ? "text-green-400" : "text-red-400"}`}
                    >
                      {bitcoinStatus.connected ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bitcoin Version</span>
                      <span className="text-gray-300">
                        {bitcoinStatus.version}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Network</span>
                      <span className="text-gray-300">
                        {bitcoinStatus.network}
                      </span>
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

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleConnect}
                      disabled={bitcoinStatus.connected}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                      Connect
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={!bitcoinStatus.connected}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                  </div>

                  <button
                    onClick={testBitcoinConnection}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-all text-sm"
                  >
                    Refresh Status
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
                <h4 className="text-base font-medium text-white">
                  ZMQ Endpoints
                </h4>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    ZMQ Raw Block
                  </label>
                  <input
                    type="text"
                    name="zmqRawBlock"
                    value={settings.zmqRawBlock}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ZMQ endpoint for raw block notifications
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    ZMQ Raw Transaction
                  </label>
                  <input
                    type="text"
                    name="zmqRawTx"
                    value={settings.zmqRawTx}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ZMQ endpoint for raw transaction notifications
                  </p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-400">
                    ⚠️ <strong>Note:</strong> Both ZMQ ports should be set to
                    28332 for proper operation.
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
                  zmqpubrawblock={settings.zmqRawBlock}
                  <br />
                  zmqpubrawtx={settings.zmqRawTx}
                </div>

                <button
                  onClick={copyZmqConfig}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-all"
                >
                  📋 Copy ZMQ Config
                </button>

                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                  <p className="text-xs text-blue-400">
                    💡 After adding ZMQ config, restart Bitcoin Core for changes
                    to take effect.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Saved!
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

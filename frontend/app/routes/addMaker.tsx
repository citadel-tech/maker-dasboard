import Nav from "../components/Nav";
import { useState } from "react";

export default function AddMaker() {
  const [formData, setFormData] = useState({
    name: "",
    rpcPort: "",
    bitcoinRpc: "127.0.0.1:18443",
    bitcoinUser: "",
    bitcoinPassword: "",
    zmq: "tcp://127.0.0.1:29332",
    dataDir: "",
    taproot: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission - start maker process
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold">Add New Maker</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-400 ml-14">
            Configure a new maker instance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Maker Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Maker 1"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A friendly name to identify this maker
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  RPC Port *
                </label>
                <input
                  type="number"
                  name="rpcPort"
                  value={formData.rpcPort}
                  onChange={handleChange}
                  placeholder="e.g., 6103"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Port for the maker RPC server (each maker needs a unique port)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Data Directory *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="dataDir"
                    value={formData.dataDir}
                    onChange={handleChange}
                    placeholder="e.g., ~/.coinswap/maker1"
                    required
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Open file browser dialog
                      console.log("Open directory picker");
                    }}
                    className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
                  >
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Directory where maker data will be stored
                </p>
              </div>
            </div>
          </div>

          {/* Bitcoin Connection */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Bitcoin Connection</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bitcoin RPC *
                </label>
                <input
                  type="text"
                  name="bitcoinRpc"
                  value={formData.bitcoinRpc}
                  onChange={handleChange}
                  placeholder="e.g., 127.0.0.1:18443"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bitcoin Core RPC endpoint (host:port)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bitcoin RPC Username *
                  </label>
                  <input
                    type="text"
                    name="bitcoinUser"
                    value={formData.bitcoinUser}
                    onChange={handleChange}
                    placeholder="e.g., user"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bitcoin RPC Password *
                  </label>
                  <input
                    type="password"
                    name="bitcoinPassword"
                    value={formData.bitcoinPassword}
                    onChange={handleChange}
                    placeholder="e.g., password"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500 font-mono text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-3">
                Bitcoin RPC credentials for authentication
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  ZMQ Endpoint *
                </label>
                <input
                  type="text"
                  name="zmq"
                  value={formData.zmq}
                  onChange={handleChange}
                  placeholder="e.g., tcp://127.0.0.1:29332"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-gray-100 placeholder-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ZeroMQ endpoint for blockchain notifications
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="taproot"
                  checked={formData.taproot}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 focus:ring-2"
                />
                <div>
                  <div className="font-medium text-gray-100">
                    Enable Taproot
                  </div>
                  <div className="text-sm text-gray-500">
                    Use Taproot addresses for improved privacy and lower fees
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Command Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3">Command Preview</h3>
            <div className="bg-black rounded-lg p-4 overflow-x-auto">
              <code className="text-xs sm:text-sm text-green-400 font-mono break-all">
                ./makerd -a {formData.bitcoinUser || "user"}:
                {formData.bitcoinPassword || "password"} -r{" "}
                {formData.bitcoinRpc} -z {formData.zmq} -d{" "}
                {formData.dataDir || "~/.coinswap/maker1"} --rpc-port 127.0.0.1:
                {formData.rpcPort || "6103"}
                {formData.taproot ? " --taproot" : ""}
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-orange-500 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold"
            >
              Add Maker
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Before adding a maker:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-300">
                <li>Ensure Bitcoin Core is running and synced</li>
                <li>Make sure the RPC port is not already in use</li>
                <li>Each maker needs a unique data directory</li>
                <li>
                  ZMQ endpoint should match your Bitcoin Core configuration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Nav from "../components/Nav"
import { useState } from "react"
import { useParams } from "react-router-dom"

// This would come from route params in real implementation
// For now using mock data
const mockMaker = {
  id: 1,
  name: 'Maker 1',
  port: 6103,
  status: 'online',
  balance: '0.85',
  activeSwaps: 2,
  earnings: '0.0089',
  uptime: '24h 15m',
  dataDir: '~/.coinswap/maker1',
  bitcoinRpc: '127.0.0.1:18443',
  torAddress: 'abcd1234...xyz.onion:6102',
  balances: {
    regular: '0.42',
    swap: '0.25',
    contract: '0.00',
    fidelity: '0.10',
    spendable: '0.67'
  }
}

const mockSwapHistory = [
  { id: 1, amount: '0.5', fee: '0.0025', status: 'completed', time: '2 hours ago' },
  { id: 2, amount: '0.3', fee: '0.0015', status: 'completed', time: '5 hours ago' },
  { id: 3, amount: '0.8', fee: '0.004', status: 'completed', time: '1 day ago' },
]

export default function MakerDetails() {
  const { makerId } = useParams<{ makerId: string }>()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'swaps' | 'logs'>('dashboard')
  
  // TODO: Fetch maker data based on makerId
  console.log('Viewing maker:', makerId)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${
                mockMaker.status === 'online'
                  ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  : 'bg-gray-600'
              }`} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{mockMaker.name}</h1>
                <p className="text-sm text-gray-400">Port: {mockMaker.port}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-sm">
              Sync Wallet
            </button>
            <button className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-orange-500 transition-all text-sm">
              {mockMaker.status === 'online' ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <div className="text-sm text-orange-100 mb-1">Status</div>
                <div className="text-xl sm:text-2xl font-bold text-white">Running</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-orange-100 mb-1">Uptime</div>
              <div className="text-xl sm:text-2xl font-bold text-white">{mockMaker.uptime}</div>
            </div>
            <div className="sm:max-w-xs">
              <div className="text-sm text-orange-100 mb-1">Tor Address</div>
              <div className="text-xs sm:text-sm font-mono text-white bg-white/10 px-3 py-2 rounded-lg truncate">
                {mockMaker.torAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 sm:px-6 py-3 font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-4 sm:px-6 py-3 font-medium transition-all ${
                activeTab === 'wallet'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`px-4 sm:px-6 py-3 font-medium transition-all ${
                activeTab === 'swaps'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Swap History
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 sm:px-6 py-3 font-medium transition-all ${
                activeTab === 'logs'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Logs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                <div className="text-2xl font-bold text-orange-500">{mockMaker.balance} BTC</div>
                <div className="text-xs text-gray-500 mt-1">${(parseFloat(mockMaker.balance) * 95000).toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Active Swaps</div>
                <div className="text-2xl font-bold text-blue-500">{mockMaker.activeSwaps}</div>
                <div className="text-xs text-gray-500 mt-1">In progress</div>
              </div>
              <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Total Earnings</div>
                <div className="text-2xl font-bold text-emerald-500">{mockMaker.earnings} BTC</div>
                <div className="text-xs text-gray-500 mt-1">${(parseFloat(mockMaker.earnings) * 45000).toFixed(2)}</div>
              </div>
              <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Swap Count</div>
                <div className="text-2xl font-bold text-purple-500">47</div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>
            </div>

            {/* Wallet Balances */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Wallet Balances</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(mockMaker.balances).map(([type, amount]) => (
                  <div key={type} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium capitalize text-gray-100">{type}</div>
                      {type === 'spendable' && (
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Available</span>
                      )}
                    </div>
                    <div className={`text-xl font-bold mb-1 ${type === 'spendable' ? 'text-emerald-500' : 'text-orange-500'}`}>
                      {amount} BTC
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      ${(parseFloat(amount) * 45000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      {type === 'regular' && 'Single signature wallet coins'}
                      {type === 'swap' && '2of2 multisig coins from swaps'}
                      {type === 'contract' && 'Live contract transactions'}
                      {type === 'fidelity' && 'Locked in fidelity bonds'}
                      {type === 'spendable' && 'Available to spend'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Data Directory</div>
                  <div className="font-mono text-sm text-gray-100 break-all">{mockMaker.dataDir}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Bitcoin RPC</div>
                  <div className="font-mono text-sm text-gray-100">{mockMaker.bitcoinRpc}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">RPC Port</div>
                  <div className="font-mono text-sm text-gray-100">{mockMaker.port}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receive */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Receive Bitcoin</h3>
                <button className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold">
                  Generate New Address
                </button>
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">Latest Address</div>
                  <div className="font-mono text-sm break-all">bc1q...7x4m</div>
                </div>
              </div>

              {/* Send */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Send Bitcoin</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Address</label>
                    <input 
                      type="text" 
                      placeholder="bc1q..." 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Amount (BTC)</label>
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* UTXOs */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">UTXOs</h3>
              <p className="text-gray-400 text-sm">UTXO list will be displayed here</p>
            </div>
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Swap History</h3>
            <div className="space-y-3">
              {mockSwapHistory.map(swap => (
                <div key={swap.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-800 last:border-b-0 gap-2">
                  <div>
                    <div className="font-medium">{swap.amount} BTC</div>
                    <div className="text-sm text-gray-400">Fee: {swap.fee} BTC</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                      {swap.status}
                    </span>
                    <span className="text-sm text-gray-500">{swap.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Logs</h3>
            <div className="bg-black rounded-lg p-4 font-mono text-xs sm:text-sm space-y-1 max-h-96 overflow-y-auto">
              <div className="text-gray-400">[2025-01-15 10:23:45] INFO: Maker started successfully</div>
              <div className="text-green-400">[2025-01-15 10:23:46] INFO: Connected to Bitcoin RPC</div>
              <div className="text-blue-400">[2025-01-15 10:24:12] INFO: New swap request received</div>
              <div className="text-green-400">[2025-01-15 10:24:15] INFO: Swap completed successfully</div>
              <div className="text-gray-400">[2025-01-15 10:25:33] INFO: Wallet synced</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
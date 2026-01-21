import type { Route } from "./+types/home"
import Nav from "../components/Nav"
import { Link } from "react-router"

// Types
interface Maker {
  id: number
  name: string
  port: number
  status: 'online' | 'offline'
  balance: string
  activeSwaps: number
  earnings: string
  uptime: string
}

interface Activity {
  id: number
  type: string
  maker: string
  details: string
  status?: 'success'
  time: string
}

// Mock data
const mockMakers: Maker[] = [
  {
    id: 1,
    name: 'Maker 1',
    port: 6103,
    status: 'online',
    balance: '0.85',
    activeSwaps: 2,
    earnings: '0.0089',
    uptime: '24h 15m'
  },
  {
    id: 2,
    name: 'Maker 2',
    port: 6104,
    status: 'online',
    balance: '1.32',
    activeSwaps: 3,
    earnings: '0.0145',
    uptime: '72h 43m'
  },
  {
    id: 3,
    name: 'Maker 3',
    port: 6105,
    status: 'online',
    balance: '0.30',
    activeSwaps: 0,
    earnings: '0.0000',
    uptime: '2h 12m'
  },
   {
    id: 4,
    name: 'Maker 4',
    port: 6106,
    status: 'online',
    balance: '0.85',
    activeSwaps: 2,
    earnings: '0.0089',
    uptime: '24h 15m'
  },
]

const mockActivity: Activity[] = [
  {
    id: 1,
    type: 'Swap Completed',
    maker: 'Maker 2',
    details: '0.5 BTC • Fee: 0.0025 BTC',
    status: 'success',
    time: '2 min ago'
  },
  {
    id: 2,
    type: 'New Address Generated',
    maker: 'Maker 1',
    details: 'bc1q...7x4m',
    time: '15 min ago'
  },
  {
    id: 3,
    type: 'Swap Completed',
    maker: 'Maker 1',
    details: '0.3 BTC • Fee: 0.0015 BTC',
    status: 'success',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'Funds Received',
    maker: 'Maker 3',
    details: '0.3 BTC',
    time: '2 hours ago'
  },
  {
    id: 5,
    type: 'Maker Started',
    maker: 'Maker 3',
    details: 'Port 6105',
    time: '2 hours ago'
  }
]

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Coinswap Maker Dashboard" },
    { name: "description", content: "Manage your Coinswap makers" },
  ]
}

export default function Home() {
  // Calculate totals
  const totalBalance = mockMakers.reduce((sum, m) => sum + parseFloat(m.balance), 0).toFixed(2)
  const totalSwaps = mockMakers.reduce((sum, m) => sum + m.activeSwaps, 0)
  const totalEarnings = mockMakers.reduce((sum, m) => sum + parseFloat(m.earnings), 0).toFixed(4)
  const onlineMakers = mockMakers.filter(m => m.status === 'online').length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Total Balance</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-500">{totalBalance} BTC</div>
            <div className="text-xs text-gray-500 mt-1">Across {mockMakers.length} makers</div>
          </div>
          
          <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Active Swaps</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-500">{totalSwaps}</div>
            <div className="text-xs text-gray-500 mt-1">In progress</div>
          </div>
          
          <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Total Earnings</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{totalEarnings} BTC</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          
          <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">System Health</div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-500">{onlineMakers}/{mockMakers.length}</div>
            <div className="text-xs text-gray-500 mt-1">Makers online</div>
          </div>
        </div>

        {/* Makers Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Your Makers</h2>
            <Link to="/addMaker" className="px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold text-sm w-full sm:w-auto">
              + Add New Maker
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {mockMakers.map(maker => (
              <div key={maker.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      maker.status === 'online'
                        ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        : 'bg-gray-600'
                    }`} />
                    <h3 className="text-base sm:text-lg font-semibold">{maker.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500">Port: {maker.port}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Balance</div>
                    <div className="text-sm sm:text-base font-semibold">{maker.balance} BTC</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Active Swaps</div>
                    <div className="text-sm sm:text-base font-semibold">{maker.activeSwaps}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Earnings</div>
                    <div className="text-sm sm:text-base font-semibold">{maker.earnings} BTC</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Uptime</div>
                    <div className="text-sm sm:text-base font-semibold">{maker.uptime}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/makerDetails/${maker.id}`} className="flex-1 text-center py-2 px-3 sm:px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm font-semibold">
                    Manage
                  </Link>
                  <button className="py-2 px-3 sm:px-4 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-orange-500 transition-all text-sm">
                    Stop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5">Recent Activity</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5">
            {mockActivity.map(activity => (
              <div key={activity.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 border-b border-gray-800 last:border-b-0 gap-2 sm:gap-0">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-100">{activity.type}</div>
                  <div className="text-xs text-gray-400 break-all">{activity.maker} • {activity.details}</div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {activity.status === 'success' && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      SUCCESS
                    </span>
                  )}
                  <div className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
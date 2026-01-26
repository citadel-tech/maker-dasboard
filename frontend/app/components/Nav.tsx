import { Link, useLocation } from "react-router-dom"

export default function Nav() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-orange-500">
              Coinswap
            </Link>
            <div className="hidden sm:flex gap-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/') ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/maker" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/maker') ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                Makers
              </Link>
              <Link 
                to="/settings" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/settings') ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
import { Link, useLocation } from 'react-router'
import { useState } from 'react'

export default function Nav() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-orange-500">
            ⚡ Coinswap Maker
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-3 lg:gap-5">
            <Link
              to="/"
              className={`px-3 lg:px-5 py-2 rounded-lg text-sm lg:text-base font-medium transition-all ${
                isActive('/')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/maker"
              className={`px-3 lg:px-5 py-2 rounded-lg text-sm lg:text-base font-medium transition-all ${
                isActive('/maker')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Maker
            </Link>
            <Link
              to="/settings"
              className={`px-3 lg:px-5 py-2 rounded-lg text-sm lg:text-base font-medium transition-all ${
                isActive('/settings')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                isActive('/')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/maker"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                isActive('/maker')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Maker
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                isActive('/settings')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
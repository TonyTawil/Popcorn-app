import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <header className="bg-primary">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">Popcorn</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={`${
                  location.pathname === '/' 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Home
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/watchlist" 
                    className={`${
                      location.pathname === '/watchlist' 
                        ? 'text-accent' 
                        : 'text-white hover:text-accent'
                    } px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    Watchlist
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-white hover:text-accent py-2">
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="text-gray-200 text-sm font-medium">
                        {user.username}
                      </span>
                    </button>
                    <div className="absolute right-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                      <div className="bg-gray-900 rounded-lg shadow-xl py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-white hover:text-accent hover:bg-gray-800 transition-colors"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:text-accent hover:bg-gray-800 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all transform hover:scale-[1.02] font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar 
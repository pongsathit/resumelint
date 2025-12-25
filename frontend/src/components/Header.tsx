import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import LoginModal from './LoginModal'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    setShowUserMenu(false)
    await logout()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-solid border-gray-200 dark:border-surface-border bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 lg:px-10 max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 text-primary">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight dark:text-white">resumelint</h2>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#features">Features</a>
            <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#pricing">Pricing</a>
            <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#about">About</a>
          </div>

          <div className="flex gap-3 items-center">
            {isAuthenticated && user ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-border transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold dark:text-white text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.subscriptionTier}</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">expand_more</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c2333] border border-gray-200 dark:border-[#282e39] rounded-lg shadow-lg py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-[#282e39]">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252b3d] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="hidden sm:flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 hover:bg-gray-200 dark:hover:bg-surface-border transition-colors dark:text-white text-sm font-bold"
                >
                  <span className="truncate">Sign In</span>
                </button>
                <Link to="/input">
                  <Button variant="primary" size="sm">
                    <span className="truncate">Get Started</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

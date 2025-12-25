import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, error, clearError, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await login({
        provider: 'email',
        email: email.trim(),
        password: password || 'demo', // Any password works with mock backend
      })
      onClose()
      setEmail('')
      setPassword('')
    } catch (err) {
      // Error is handled by AuthContext
    }
  }

  const handleDemoLogin = async (demoEmail: string, tierName: string) => {
    try {
      clearError()
      await login({
        provider: 'email',
        email: demoEmail,
        password: 'demo',
      })
      onClose()
    } catch (err) {
      // Error is handled by AuthContext
      console.error(`Demo login failed for ${tierName}:`, err)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c2333] rounded-2xl border border-gray-200 dark:border-[#282e39] shadow-2xl mx-4">
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}

        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-200 dark:border-[#282e39]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined text-2xl">bug_report</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">resumelint</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Sign in to analyze your resume and access all features
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <ErrorMessage
              error={error}
              onDismiss={clearError}
              className="mb-6"
            />
          )}

          {/* Demo Account Buttons */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
              Quick Demo Login
            </p>
            <button
              onClick={() => handleDemoLogin('john.doe@example.com', 'Free Tier')}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#151a25] border border-gray-200 dark:border-[#3b4354] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1c2333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">person</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Free Tier Demo</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">john.doe@example.com</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-[#282e39] text-slate-600 dark:text-gray-300 rounded font-medium">
                1 analysis/month
              </span>
            </button>

            <button
              onClick={() => handleDemoLogin('jane.smith@example.com', 'Pro Tier')}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 dark:border-primary/50 rounded-lg hover:from-primary/20 hover:to-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">workspace_premium</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Pro Tier Demo</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">jane.smith@example.com</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary dark:text-primary rounded font-medium">
                Unlimited
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#282e39]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-[#1c2333] text-slate-500 dark:text-gray-400">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#151a25] border border-gray-300 dark:border-[#3b4354] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Password
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-gray-400">(optional for demo)</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#151a25] border border-gray-300 dark:border-[#3b4354] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <p className="mt-6 text-xs text-center text-slate-500 dark:text-gray-500">
            This is a demo environment. Any email works with the mock backend.
          </p>
        </div>
      </div>
    </div>
  )
}

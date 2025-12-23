import { Link } from 'react-router-dom'
import Button from './Button'

export default function Header() {
  return (
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

        <div className="flex gap-3">
          <button className="hidden sm:flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 hover:bg-gray-200 dark:hover:bg-surface-border transition-colors dark:text-white text-sm font-bold">
            <span className="truncate">Sign In</span>
          </button>
          <Button variant="primary" size="sm">
            <span className="truncate">Get Started</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

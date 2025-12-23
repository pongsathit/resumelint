import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="material-symbols-outlined text-[16px] text-slate-600">chevron_right</span>
          )}
        </div>
      ))}
    </nav>
  )
}

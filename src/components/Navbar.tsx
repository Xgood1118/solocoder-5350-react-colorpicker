import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: '取色器' },
  { to: '/contrast', label: '对比度' },
  { to: '/palette', label: '调色板' },
  { to: '/settings', label: '设置' },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="text-2xl">🎨</span>
          <span>ColorKit</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="ml-2 pl-2 border-l">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

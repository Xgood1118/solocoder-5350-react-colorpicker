import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="text-lg">🌓</span>
      </Button>
    )
  }

  const current = resolvedTheme || theme
  const isDark = current === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="切换主题"
    >
      <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
    </Button>
  )
}

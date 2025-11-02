import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui'
import { useTheme } from '@/components/theme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <div className="flex items-center gap-2">
      <Moon className="h-5 w-5" />
      <Switch
        checked={isLight}
        onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
        aria-label="Toggle theme"
      />
      <Sun className="h-5 w-5" />
    </div>
  )
}

import { ClipboardList } from 'lucide-react'
import { ThemeToggle } from '@/components/theme'

export function Header() {
  return (
    <header className="w-full bg-background">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between px-2 px-6 py-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          <h1 className="text-xl font-bold">Checkmate</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

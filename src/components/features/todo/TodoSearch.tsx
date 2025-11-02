import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ChangeEvent,
} from 'react'
import { Search, X } from 'lucide-react'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui'

interface TodoSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

const DEBOUNCE_DELAY = 200

export function TodoSearch({ searchQuery, onSearchChange }: TodoSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(localQuery)
    }, DEBOUNCE_DELAY)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [localQuery, onSearchChange])

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setLocalQuery('')
    onSearchChange('')
  }, [onSearchChange])

  return (
    <InputGroup>
      <InputGroupInput
        value={localQuery}
        onChange={handleChange}
        placeholder="Search todos..."
        aria-label="Search todos"
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <X
          onClick={handleClear}
          className="h-4 w-4 cursor-pointer"
          aria-label="Clear search"
        />
      </InputGroupAddon>
    </InputGroup>
  )
}

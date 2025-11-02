import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import type { TodoFilter, Todo } from '@/types/todo'

interface TodoFilterProps {
  filter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  todos: Todo[]
}

/**
 * TodoFilter component using tabs to filter todos
 * Three tabs: All (default), Active, Completed with count badges
 */
export function TodoFilter({ filter, onFilterChange, todos }: TodoFilterProps) {
  /**
   * Calculate todo counts
   */
  const counts = useMemo(() => {
    const active = todos.filter((todo) => !todo.completed).length
    const completed = todos.filter((todo) => todo.completed).length
    return {
      all: todos.length,
      active,
      completed,
    }
  }, [todos])

  const renderTrigger = (value: TodoFilter, text: string, count: number) => {
    return (
      <TabsTrigger value={value} aria-label={`Filter todos by ${text}`}>
        {text} {`(${count})`}
      </TabsTrigger>
    )
  }

  return (
    <Tabs
      value={filter}
      onValueChange={(value) => onFilterChange(value as TodoFilter)}
    >
      <TabsList className="gap-1 font-bold">
        {renderTrigger('all', 'All', counts.all)}
        {renderTrigger('active', 'Active', counts.active)}
        {renderTrigger('completed', 'Completed', counts.completed)}
      </TabsList>
    </Tabs>
  )
}

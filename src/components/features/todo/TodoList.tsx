import { useMemo } from 'react'
import { ClipboardList } from 'lucide-react'
import { TodoItem } from './TodoItem'
import type { Todo, TodoFilter } from '@/types/todo'
import { ItemGroup } from '@/components/ui'

interface TodoListProps {
  todos: Todo[]
  filter: TodoFilter
  searchQuery: string
}

function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    default:
      return todos
  }
}

function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt - a.createdAt
    }
    return a.completed ? 1 : -1
  })
}

function getEmptyStateMessage(filter: TodoFilter) {
  switch (filter) {
    case 'active':
      return {
        title: 'No active todos',
        subtitle: 'All your tasks are complete! 🎉',
      }
    case 'completed':
      return {
        title: 'No completed todos',
        subtitle: 'Complete a task to see it here.',
      }
    default:
      return {
        title: 'No todos yet!',
        subtitle: 'Add one above to get started.',
      }
  }
}

function searchTodos(todos: Todo[], query: string): Todo[] {
  if (!query.trim()) return todos
  const lowerQuery = query.toLowerCase().trim()
  return todos.filter((todo) => todo.text.toLowerCase().includes(lowerQuery))
}

export function TodoList({ todos, filter, searchQuery }: TodoListProps) {
  const displayTodos = useMemo(() => {
    const filtered = filterTodos(todos, filter)
    const searched = searchTodos(filtered, searchQuery)
    return sortTodos(searched)
  }, [todos, filter, searchQuery])

  const emptyState = getEmptyStateMessage(filter)

  if (displayTodos.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground duration-500 animate-in fade-in">
        <ClipboardList className="mx-auto mb-4 h-16 w-16 opacity-20 delay-150" />
        <p className="text-lg">
          {searchQuery ? 'No todos found' : emptyState.title}
        </p>
        <p className="text-sm">
          {searchQuery ? 'Try a different search term' : emptyState.subtitle}
        </p>
      </div>
    )
  }

  return (
    <ItemGroup className="space-y-3">
      {displayTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ItemGroup>
  )
}

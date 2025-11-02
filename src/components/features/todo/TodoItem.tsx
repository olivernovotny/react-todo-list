import { useCallback } from 'react'
import { Checkbox, Button } from '@/components/ui'
import { useTodoStore } from '@/store/todoStore'
import type { Todo } from '@/types/todo'
import { toast } from 'sonner'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemActions,
} from '@/components/ui'

export function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, deleteTodo, restoreTodo } = useTodoStore()

  const handleToggle = useCallback(() => {
    toggleTodo(todo.id)
  }, [todo.id, toggleTodo])

  /**
   * Handle deleting todo with undo toast notification
   */
  const handleDelete = useCallback(() => {
    deleteTodo(todo.id)

    toast('Todo deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreTodo(todo),
      },
      duration: 5000,
    })
  }, [todo, deleteTodo, restoreTodo])

  return (
    <Item variant="outline" className={`${todo.completed ? 'opacity-60' : ''}`}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="h-5 w-5 shrink-0"
        aria-label={`Toggle ${todo.text}`}
      />
      <ItemContent>
        <ItemDescription
          className={`line-clamp-5 text-wrap text-left text-primary ${todo.completed ? 'line-through' : ''}`}
        >
          {todo.text}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          aria-label="Delete todo"
        >
          Delete
        </Button>
      </ItemActions>
    </Item>
  )
}

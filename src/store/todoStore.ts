import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Todo } from '@/types/todo'

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  restoreTodo: (todo: Todo) => void
  updateTodo: (id: string, text: string) => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              text: text.trim(),
              completed: false,
              createdAt: Date.now(),
            },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      restoreTodo: (todo) =>
        set((state) => ({
          todos: [...state.todos, todo],
        })),
      updateTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: text.trim() } : todo
          ),
        })),
    }),
    {
      name: 'todoStorage',
    }
  )
)

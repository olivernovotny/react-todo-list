import { useState } from 'react'
import { Toaster } from '@/components/ui'
import { Header } from '@/components/layout'
import {
  AddTodo,
  TodoSearch,
  TodoFilter,
  TodoList,
} from '@/components/features/todo'
import { useTodoStore } from '@/store/todoStore'
import type { TodoFilter as TodoFilterType } from '@/types/todo'
import './App.css'

function App() {
  const [filter, setFilter] = useState<TodoFilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const todos = useTodoStore((state) => state.todos)

  return (
    <>
      <Header />
      <div className="justify-betweenl m-6 flex max-w-[1350px] flex-col md:flex-row">
        <AddTodo />
        <div className="mt-8 w-full md:ml-6 md:mt-0">
          <div className="mb-3 flex flex-col gap-3 md:flex-row">
            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              todos={todos}
            />
            <TodoSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <TodoList todos={todos} filter={filter} searchQuery={searchQuery} />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App

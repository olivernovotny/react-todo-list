import {
  useState,
  useCallback,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui'
import { Textarea } from '@/components/ui'
import { useTodoStore } from '@/store/todoStore'

const MAX_LENGTH = 300
const WARNING_THRESHOLD = 260

export function AddTodo() {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const addTodo = useTodoStore((state) => state.addTodo)

  const getCounterColor = useCallback(() => {
    if (text.length >= MAX_LENGTH) {
      return 'text-destructive'
    }
    if (text.length > WARNING_THRESHOLD) {
      return 'text-amber-600 dark:text-amber-500'
    }
    return 'text-muted-foreground'
  }, [text.length])

  const handleAddTodo = useCallback(() => {
    const trimmedText = text.trim()
    if (trimmedText) {
      addTodo(trimmedText)
      setText('')
    }
  }, [text, addTodo])

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= MAX_LENGTH) {
      setText(newValue)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleAddTodo()
      } else if (e.key === 'Escape') {
        setText('')
      }
    },
    [handleAddTodo]
  )

  const isDisabled = !text.trim()

  return (
    <Card className="h-full w-full md:max-w-[300px]">
      <CardHeader>
        <CardTitle>New Todo</CardTitle>
        <CardDescription>Add a new todo to your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          aria-label="New todo text"
        />
        <div className={`mt-1 text-xs md:text-sm ${getCounterColor()}`}>
          {text.length}/{MAX_LENGTH}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={handleAddTodo}
          disabled={isDisabled}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}

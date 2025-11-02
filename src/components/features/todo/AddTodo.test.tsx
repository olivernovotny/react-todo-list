import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTodo } from './AddTodo'
import { useTodoStore } from '@/store/todoStore'

jest.mock('@/store/todoStore')

const mockAddTodo = jest.fn()
;(useTodoStore as jest.MockedFunction<typeof useTodoStore>).mockImplementation(
  (selector: any) => {
    const mockStore = {
      addTodo: mockAddTodo,
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
      restoreTodo: jest.fn(),
      updateTodo: jest.fn(),
      todos: [],
    }
    return selector ? selector(mockStore) : mockStore
  }
)

describe('AddTodo', () => {
  beforeEach(() => {
    mockAddTodo.mockClear()
  })

  it('renders the component with all elements', () => {
    render(<AddTodo />)

    expect(screen.getByText('New Todo')).toBeInTheDocument()
    expect(screen.getByText('Add a new todo to your list.')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('What needs to be done?')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    expect(screen.getByText(/0\/300/)).toBeInTheDocument()
  })

  it('displays initial character count as 0/300', () => {
    render(<AddTodo />)
    expect(screen.getByText('0/300')).toBeInTheDocument()
  })

  it('updates character count as user types', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    await user.type(textarea, 'Hello')

    expect(screen.getByText('5/300')).toBeInTheDocument()
  })

  it('adds todo when button is clicked', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(textarea, 'Buy groceries')
    await user.click(addButton)

    expect(mockAddTodo).toHaveBeenCalledWith('Buy groceries')
  })

  it('adds todo when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    await user.type(textarea, 'Finish homework{Enter}')

    expect(mockAddTodo).toHaveBeenCalledWith('Finish homework')
  })

  it('does not add todo when Shift+Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    await user.type(
      textarea,
      'First line{Shift>}{Enter}{/Shift}Second line{Enter}'
    )

    expect(mockAddTodo).toHaveBeenCalledTimes(1)
    expect(mockAddTodo).toHaveBeenCalledWith('First line\nSecond line')
  })

  it('clears input after adding a todo', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLTextAreaElement
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(textarea, 'Test todo')
    await user.click(addButton)

    expect(textarea.value).toBe('')
    expect(screen.getByText('0/300')).toBeInTheDocument()
  })

  it('clears input when Escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLTextAreaElement
    await user.type(textarea, 'Test todo{Escape}')

    expect(textarea.value).toBe('')
    expect(screen.getByText('0/300')).toBeInTheDocument()
  })

  it('does not add todo with whitespace-only text', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(textarea, '   {Enter}')
    await user.click(addButton)

    expect(mockAddTodo).not.toHaveBeenCalled()
  })

  it('has button disabled when text is empty or whitespace only', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    expect(addButton).toBeDisabled()

    await user.type(textarea, '   ')
    expect(addButton).toBeDisabled()

    await user.clear(textarea)
    await user.type(textarea, 'Valid todo')
    expect(addButton).toBeEnabled()
  })

  it('enforces 300 character limit', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    const longText = 'A'.repeat(301)

    await user.type(textarea, longText)

    expect(textarea).toHaveValue('A'.repeat(300))
    expect(screen.getByText('300/300')).toBeInTheDocument()
  })

  describe('Character counter colors', () => {
    it('shows normal color when under 260 characters', async () => {
      const user = userEvent.setup()
      render(<AddTodo />)

      const textarea = screen.getByPlaceholderText('What needs to be done?')
      await user.type(textarea, 'Short todo')

      const counter = screen.getByText(/\/300/)
      expect(counter.className).toContain('text-muted-foreground')
      expect(counter.className).not.toContain('text-amber')
      expect(counter.className).not.toContain('text-destructive')
    })

    it('shows warning color when between 260-300 characters', async () => {
      const user = userEvent.setup()
      render(<AddTodo />)

      const textarea = screen.getByPlaceholderText('What needs to be done?')
      const text = 'A'.repeat(270)
      await user.type(textarea, text)

      const counter = screen.getByText(/270\/300/)
      expect(counter.className).toContain('text-amber')
    })

    it('shows destructive color when at 300 characters', async () => {
      const user = userEvent.setup()
      render(<AddTodo />)

      const textarea = screen.getByPlaceholderText('What needs to be done?')
      const text = 'A'.repeat(300)
      await user.type(textarea, text)

      const counter = screen.getByText(/300\/300/)
      expect(counter.className).toContain('text-destructive')
    })
  })

  it('trims whitespace before adding todo', async () => {
    const user = userEvent.setup()
    render(<AddTodo />)

    const textarea = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(textarea, '  Padded text  ')
    await user.click(addButton)

    expect(mockAddTodo).toHaveBeenCalledWith('Padded text')
  })
})

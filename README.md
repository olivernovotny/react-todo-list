# Architectural decisions and code explanation

### Tech stack selection

I chose React 19 with TypeScript to use modern React patterns while keeping the code type safe. TypeScript prevents runtime errors and serves as inline documentation, critical for maintainable code. Vite replaces Create React App for faster and optimized builds using native ES modules. shadcn/ui provides production-ready accessible components without bundle bloat, copying code into the project for full customization control which is super cool when fighting bugs rooting deep inside library compoents.

### State management: Zustand over Redux/Context

Zustand was selected over Redux and Context API for couple of reasons. For a todo list scope, Redux adds unnecessary boilerplate—actions, reducers, and store configuration would require 50+ lines versus Zustand's 10 lines for equivalent functionality. Context API introduces re-render performance issues where all consumers re-render on any state change.

Zustand provides clean state mutations, excellent TypeScript inference, and built-in middleware that automatically handles LocalStorage requirements. It also eliminates manual localStorage read/write code, simplifying the implementation comparing to other two options

In the end I decided to use native Context API as well for my theme change. The problem with all child elements being rerendered on context change is meaningless since I need 90% of them to switch colors(rerender) anyway.

### Component architecture

Functional components with hooks follow React 19 best practices. Components follow the single responsibility principle:

- AddTodo handles input and submission
- TodoItem handles individual todo display and actions
- TodoList manages filtering and sorting logic

Custom hooks like useTheme encapsulate theme logic for reusability. Memoization with useMemo prevents unnecessary recalculations in TodoList when filtering or sorting large lists. Component composition allows each piece to be tested and maintained independently.

### State persistence implementation

Zustand's persist middleware automatically serializes todos array to localStorage on every state change and restores it on application reload. The store configuration uses a storage key 'todoStorage'.

This approach requires zero manual setting up or localStorage API calls in components. The middleware handles edge cases like circular references and provides versioning capabilities if schema changes are needed later.

### Sorting logic for completed todos

Completed todos automatically move to the end using a sorting function that separates active and completed todos, then sorts each group by creation timestamp. Active todos are sorted by time they were added, and completed todos also by createdAt but appear after all active todos. This ensures newly completed tasks move to the bottom while maintaining chronological order within each group.

### Testing approach

Jest with React Testing Library follows RTL's philosophy of testing user behavior, not implementation details. The AddTodo component tests verify user interactions—typing in the input, submitting todos, clearing on Escape key.

Tests use getByRole and userEvent to simulate real user behavior, ensuring tests remain stable when internal implementation changes but user-facing behavior stays consistent. Setup includes jsdom environment and path alias resolution for clean imports.

### Responsive design implementation

Mobile-first responsive design uses Tailwind’s breakpoint system. Components adapt layout at the sm:640px breakpoint:

- AddTodo switches from vertical stack to horizontal layout
- Buttons change from full-width to auto-width
- Padding adjusts proportionally

Touch targets maintain a minimum 44×44px for mobile accessibility. The wide layout spans almost full screen width using max-w-[1350px] instead of narrow centered containers, providing a better desktop experience.

### Bonus features rationale

Filtering by state (all, active, completed) uses shadcn/ui Tabs component for consistent UI patterns. Search functionality filters todos in real time using case-insensitive string matching.

Character counter with a 300-character limit prevents overly long todos while providing visual feedback with color coding as the limit approaches.

### Type safety and error prevention

TypeScript interfaces ensure todo objects always have required properties. The Todo interface enforces id, text, completed, and createdAt fields.

Function parameters and return types are explicitly typed, preventing prop mismatches and providing IDE autocomplete. Strict TypeScript configuration catches errors at compile time rather than runtime, reducing bugs before deployment.

### Code organization principles

Components are organized by feature domain, allowing related code to live together. Re-exports via index.ts files provide clean import paths.

Store logic is centralized in the Zustand store with clear action names. Utility functions like cn() for className merging are extracted to lib/utils for reuse across components.

### Performance considerations

useMemo prevents unnecessary filtering and sorting recalculations. useState for local component state like search query avoids triggering global store updates.

Event handlers use useCallback to prevent unnecessary re-renders when passed as props. Zustand’s selector pattern allows components to subscribe only to specific store slices they need, preventing unnecessary re-renders when unrelated state changes.

### Accessibility and UX enhancements

All interactive elements include proper ARIA labels. Keyboard navigation is fully supported:

- Enter to submit
- Escape to clear
- Delete key on focused todos

Focus management ensures logical tab order. shadcn/ui components built on Radix UI provide accessibility out of the box, including keyboard navigation and screen reader support.

Toast notifications position responsively—bottom-right on desktop, bottom-center on mobile.

### Possible addons in the future

- Editing existing todo (let's say when double clicking on text)
- Drag and Drop todos so the user can sort them however he likes
- Adding more fields to initial Todo form (title, label)

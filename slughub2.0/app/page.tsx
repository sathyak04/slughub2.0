import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Render the main To-Do List component */}
      <TodoList />
    </main>
  );
}
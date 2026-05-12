import { useState, useEffect, useCallback } from 'react';
import type { Todo, Priority, FilterType } from '../types/todo';

const STORAGE_KEY = 'focus-todos-v1';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text: string, priority: Priority, dueDate: string | null) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string, priority: Priority, dueDate: string | null) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text, priority, dueDate } : t));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (search && !todo.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return {
    todos: filteredTodos,
    filter, setFilter,
    search, setSearch,
    addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted,
    stats: {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    },
  };
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodos } from '../hooks/useTodos';
import { AddTodo } from './AddTodo';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import type { FilterType } from '../types/todo';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'すべて',  value: 'all' },
  { label: '未完了',  value: 'active' },
  { label: '完了済み', value: 'completed' },
];

export function TodoApp() {
  const {
    todos, filter, setFilter, search, setSearch,
    addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, stats,
  } = useTodos();

  const [showAdd, setShowAdd] = useState(false);

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const progressPct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="relative min-h-screen">
      {/* Aurora background */}
      <div className="aurora-container">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 pb-24">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-end justify-between mb-2">
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 58,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                background: 'linear-gradient(135deg, #e4e4f0 30%, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FOCUS
            </h1>
            <div className="text-right mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                <span style={{ color: 'var(--accent-bright)', fontWeight: 600 }}>{stats.active}</span> 件残り
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {stats.completed} 件完了
              </p>
            </div>
          </div>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: 'var(--text-secondary)' }}>
            {today}
          </p>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="mt-4 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, var(--accent), #a78bfa)' }}
              />
            </div>
          )}
        </motion.header>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-4"
        >
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="14" height="14" viewBox="0 0 16 16" fill="none"
              style={{ color: 'var(--text-muted)' }}
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="タスクを検索..."
              className="focus-input py-3 pl-10 pr-4 text-sm"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex items-center gap-1 mb-5"
        >
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="relative px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: filter === value ? 600 : 400,
                color: filter === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {filter === value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          ))}

          <AnimatePresence>
            {stats.completed > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearCompleted}
                className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  color: '#f87171',
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                }}
                whileHover={{ background: 'rgba(248,113,113,0.14)' }}
              >
                完了済みを削除
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add todo area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mb-4"
        >
          <AnimatePresence mode="wait">
            {showAdd ? (
              <AddTodo
                key="add-form"
                onAdd={(text, priority, dueDate) => {
                  addTodo(text, priority, dueDate);
                  setShowAdd(false);
                }}
                onCancel={() => setShowAdd(false)}
              />
            ) : (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAdd(true)}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  border: '1px dashed var(--border)',
                  color: 'var(--text-secondary)',
                }}
                whileHover={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                タスクを追加
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Todo list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <AnimatePresence initial={false}>
            {todos.length === 0 ? (
              <EmptyState key="empty" filter={filter} hasSearch={!!search} />
            ) : (
              todos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onEdit={(text, priority, dueDate) => editTodo(todo.id, text, priority, dueDate)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer stats */}
        {stats.total > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 text-xs"
            style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--text-muted)' }}
          >
            {stats.total} 件のタスク · {stats.completed} 件完了 · {stats.active} 件残り
          </motion.p>
        )}
      </div>
    </div>
  );
}

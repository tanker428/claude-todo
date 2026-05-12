import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import type { Todo, Priority } from '../types/todo';
import { AddTodo } from './AddTodo';

const PRIORITY_CONFIG: Record<Priority, { color: string; dim: string; label: string }> = {
  high:   { color: '#f87171', dim: 'rgba(248,113,113,0.18)', label: '高' },
  medium: { color: '#fb923c', dim: 'rgba(251,146,60,0.18)',  label: '中' },
  low:    { color: '#4ade80', dim: 'rgba(74,222,128,0.18)',  label: '低' },
};

function formatDueDate(dueDate: string): { text: string; color: string } {
  const date = parseISO(dueDate);
  if (isToday(date))    return { text: '今日が期限', color: '#fb923c' };
  if (isTomorrow(date)) return { text: '明日が期限', color: '#fbbf24' };
  if (isPast(date))     return { text: format(date, 'M/d') + ' 期限切れ', color: '#f87171' };
  return { text: format(date, 'M月d日'), color: 'var(--text-secondary)' };
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string, priority: Priority, dueDate: string | null) => void;
}

export function TodoItem({ todo, index, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const p = PRIORITY_CONFIG[todo.priority];
  const dueInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

  if (isEditing) {
    return (
      <AddTodo
        initialText={todo.text}
        initialPriority={todo.priority}
        initialDueDate={todo.dueDate}
        isEditing
        onAdd={(text, priority, dueDate) => { onEdit(text, priority, dueDate); setIsEditing(false); }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ duration: 0.18, delay: index * 0.025 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card px-4 py-3.5 flex items-start gap-3"
      style={{
        borderLeftWidth: 2,
        borderLeftColor: todo.completed ? 'var(--border)' : p.color,
        borderRadius: 14,
      }}
    >
      {/* Animated checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 mt-0.5 cursor-pointer"
        style={{ width: 20, height: 20 }}
        title={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        <motion.div
          className="relative rounded-full flex items-center justify-center"
          animate={{
            scale: todo.completed ? [1, 1.2, 1] : 1,
            borderColor: todo.completed ? p.color : 'var(--border-hover)',
            backgroundColor: todo.completed ? p.dim : 'transparent',
          }}
          transition={{ duration: 0.22 }}
          style={{
            width: 20,
            height: 20,
            border: '2px solid',
            borderColor: 'var(--border-hover)',
          }}
        >
          <AnimatePresence>
            {todo.completed && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="10" height="10" viewBox="0 0 10 10" fill="none"
              >
                <motion.path
                  d="M1.5 5l2.5 2.5 5-5"
                  stroke={p.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span
            className={todo.completed ? 'completed-text' : ''}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13.5,
              lineHeight: 1.55,
              color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              wordBreak: 'break-word',
              flex: 1,
            }}
          >
            {todo.text}
          </span>

          {/* Priority badge */}
          <span
            className="flex-shrink-0 rounded-md"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.06em',
              padding: '2px 7px',
              color: todo.completed ? 'var(--text-muted)' : p.color,
              background: todo.completed ? 'transparent' : p.dim,
              border: `1px solid ${todo.completed ? 'var(--border)' : p.color + '50'}`,
            }}
          >
            {p.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center mt-1.5 gap-3">
          {dueInfo && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{
                fontFamily: 'Manrope, sans-serif',
                color: todo.completed ? 'var(--text-muted)' : dueInfo.color,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M1 5h10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {dueInfo.text}
            </span>
          )}

          {/* Hover actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex items-center gap-2 ml-auto"
              >
                <button
                  onClick={() => setIsEditing(true)}
                  title="編集"
                  className="transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-bright)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M11.5 2.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={onDelete}
                  title="削除"
                  className="transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 5h10M6 5V3.5h4V5M5.5 5l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Priority } from '../types/todo';

interface AddTodoProps {
  onAdd: (text: string, priority: Priority, dueDate: string | null) => void;
  onCancel: () => void;
  initialText?: string;
  initialPriority?: Priority;
  initialDueDate?: string | null;
  isEditing?: boolean;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string; dim: string }[] = [
  { value: 'high',   label: '高', color: '#f87171', dim: 'rgba(248,113,113,0.14)' },
  { value: 'medium', label: '中', color: '#fb923c', dim: 'rgba(251,146,60,0.14)'  },
  { value: 'low',    label: '低', color: '#4ade80', dim: 'rgba(74,222,128,0.14)'  },
];

export function AddTodo({
  onAdd, onCancel,
  initialText = '',
  initialPriority = 'medium',
  initialDueDate = null,
  isEditing = false,
}: AddTodoProps) {
  const [text, setText] = useState(initialText);
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority, dueDate || null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.form
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="glass-card p-4 mb-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="タスクを入力..."
        className="mono-input mb-3"
      />

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority selector */}
        <div className="flex gap-1.5">
          {PRIORITY_OPTIONS.map(opt => {
            const active = priority === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  color: active ? opt.color : 'var(--text-muted)',
                  background: active ? opt.dim : 'transparent',
                  border: `1px solid ${active ? opt.color + '60' : 'var(--border)'}`,
                }}
              >
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: opt.color,
                    opacity: active ? 1 : 0.35,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Due date */}
        <input
          type="date"
          min={today}
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="focus-input text-xs px-2.5 py-1"
          style={{
            width: 'auto',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            color: dueDate ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        />

        {/* Action buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--text-secondary)' }}
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
            style={{
              fontFamily: 'Manrope, sans-serif',
              background: text.trim() ? 'var(--accent)' : 'var(--bg-secondary)',
              color: text.trim() ? '#fff' : 'var(--text-muted)',
            }}
          >
            {isEditing ? '保存' : '追加'}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

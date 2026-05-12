import { motion } from 'framer-motion';
import type { FilterType } from '../types/todo';

interface EmptyStateProps {
  filter: FilterType;
  hasSearch: boolean;
}

const MESSAGES = {
  all:       { icon: '✦', title: 'タスクなし',     desc: 'タスクを追加して今日を始めましょう' },
  active:    { icon: '◎', title: 'すべて完了！',   desc: '未完了のタスクはありません' },
  completed: { icon: '○', title: '完了済みなし',   desc: 'タスクを完了するとここに表示されます' },
};

export function EmptyState({ filter, hasSearch }: EmptyStateProps) {
  const msg = hasSearch
    ? { icon: '◈', title: '見つかりません', desc: '検索条件を変えてみてください' }
    : MESSAGES[filter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center select-none"
    >
      <motion.span
        animate={{ scale: [1, 1.08, 1], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 52,
          color: 'var(--text-muted)',
          display: 'block',
          marginBottom: 16,
          lineHeight: 1,
        }}
      >
        {msg.icon}
      </motion.span>
      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {msg.title}
      </p>
      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
        {msg.desc}
      </p>
    </motion.div>
  );
}

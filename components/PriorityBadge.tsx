'use client';

import { TaskPriority } from '@/lib/types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

const PRIORITY_CONFIG: Record<TaskPriority, { 
  bg: string; 
  text: string; 
  border: string;
  glow: string;
  icon: React.ReactNode;
}> = {
  urgent: {
    bg: 'bg-danger/15',
    text: 'text-danger',
    border: 'border-danger/40',
    glow: 'shadow-glow-danger/30',
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2zm0 4l7.5 14h-15L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    ),
  },
  high: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    border: 'border-warning/40',
    glow: 'shadow-glow-warning/30',
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  medium: {
    bg: 'bg-cyan/15',
    text: 'text-cyan',
    border: 'border-cyan/40',
    glow: '',
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  low: {
    bg: 'bg-text-muted/15',
    text: 'text-text-secondary',
    border: 'border-text-muted/40',
    glow: '',
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px] gap-1',
    md: 'px-2.5 py-1.5 text-xs gap-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center ${sizeClasses[size]}
        ${config.bg} ${config.text} ${config.glow}
        border ${config.border}
        rounded-lg font-mono font-semibold uppercase tracking-wider
        transition-all duration-200
      `}
    >
      {config.icon}
      <span>{priority}</span>
    </span>
  );
}

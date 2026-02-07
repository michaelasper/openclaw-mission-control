'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SerializedTask, TaskStatus, COLUMNS } from '@/lib/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: SerializedTask[];
}

const STATUS_CONFIG: Record<TaskStatus, { color: string; glow: string; icon: React.ReactNode }> = {
  backlog: {
    color: 'bg-text-muted',
    glow: 'shadow-none',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  todo: {
    color: 'bg-info',
    glow: 'shadow-[0_0_10px_rgba(0,170,255,0.3)]',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  in_progress: {
    color: 'bg-warning',
    glow: 'shadow-glow-warning',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  review: {
    color: 'bg-violet-bright',
    glow: 'shadow-glow-violet',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  done: {
    color: 'bg-success',
    glow: 'shadow-glow-success',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export default function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const column = COLUMNS.find((c) => c.id === status);
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      {/* Column Header */}
      <div className="relative mb-4">
        {/* Header card */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-deep/80 border border-elevated/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Status indicator with glow */}
            <div className={`relative p-2 rounded-lg ${config.color}/20`}>
              <div className={`absolute inset-0 rounded-lg ${config.color}/30 blur-sm`} />
              <div className={`relative ${config.color === 'bg-text-muted' ? 'text-text-muted' : config.color.replace('bg-', 'text-')}`}>
                {config.icon}
              </div>
            </div>
            
            <div>
              <h2 className="font-display font-semibold text-sm tracking-wider text-text-primary uppercase">
                {column?.title}
              </h2>
            </div>
          </div>
          
          {/* Task count badge */}
          <div className={`
            flex items-center justify-center min-w-[28px] h-7 px-2.5
            font-mono text-xs font-bold rounded-lg
            ${tasks.length > 0 
              ? 'bg-cyan/20 text-cyan border border-cyan/30' 
              : 'bg-elevated text-text-muted'
            }
          `}>
            {tasks.length}
          </div>
        </div>
        
        {/* Decorative line */}
        <div className={`
          absolute -bottom-2 left-4 right-4 h-0.5 rounded-full
          ${config.color} opacity-30
        `} />
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 p-3 rounded-2xl min-h-[200px]
          transition-all duration-300 ease-out
          ${isOver 
            ? 'bg-cyan/5 border-2 border-dashed border-cyan/50 shadow-inner-glow' 
            : 'bg-surface/30 border border-elevated/30'
          }
        `}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-12 h-12 mb-3 rounded-xl bg-elevated/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-mono text-xs text-text-muted tracking-wider uppercase">
              No tasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

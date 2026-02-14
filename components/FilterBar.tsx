'use client';

import { useAgentConfig } from "@/components/AgentConfigProvider";
import { AgentId, TaskPriority } from "@/lib/types";

interface FilterBarProps {
  filters: {
    assignee: AgentId | 'all';
    priority: TaskPriority | 'all';
    search: string;
  };
  onFilterChange: (filters: {
    assignee: AgentId | 'all';
    priority: TaskPriority | 'all';
    search: string;
  }) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { agents } = useAgentConfig();
  const hasActiveFilters = filters.assignee !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="relative px-6 py-4">
      {/* Background */}
      <div className="absolute inset-0 bg-abyss/50 backdrop-blur-sm border-y border-elevated/30" />
      
      <div className="relative flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl cyber-input text-sm text-text-primary placeholder-text-muted font-body"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-cyan transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-elevated/50" />

        {/* Assignee Filter */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">Agent</span>
          <select
            value={filters.assignee}
            onChange={(e) =>
              onFilterChange({ ...filters, assignee: e.target.value as AgentId | 'all' })
            }
            className="px-4 py-2.5 rounded-xl cyber-select text-sm text-text-primary font-body min-w-[160px]"
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.emoji} {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">Priority</span>
          <select
            value={filters.priority}
            onChange={(e) =>
              onFilterChange({ ...filters, priority: e.target.value as TaskPriority | 'all' })
            }
            className="px-4 py-2.5 rounded-xl cyber-select text-sm text-text-primary font-body min-w-[140px]"
          >
            <option value="all">All Levels</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <>
            <div className="w-px h-8 bg-elevated/50" />
            <button
              onClick={() =>
                onFilterChange({ assignee: 'all', priority: 'all', search: '' })
              }
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger/10 border border-danger/30 hover:bg-danger/20 transition-colors"
            >
              <svg className="w-4 h-4 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-xs text-danger tracking-wider uppercase">Clear</span>
            </button>
          </>
        )}

        {/* Active filter count indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-cyan tracking-wider uppercase">
              Filtered
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { SerializedAgent, SerializedTask } from '@/lib/types';
import AgentAvatar from './AgentAvatar';
import PriorityBadge from './PriorityBadge';

interface TeamStatusProps {
  agents: SerializedAgent[];
  tasks: SerializedTask[];
}

const STATUS_CONFIG = {
  active: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', label: 'ACTIVE' },
  working: { color: 'text-info', bg: 'bg-info/10', border: 'border-info/30', label: 'WORKING' },
  idle: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', label: 'IDLE' },
  offline: { color: 'text-text-muted', bg: 'bg-muted/10', border: 'border-muted/30', label: 'OFFLINE' },
};

export default function TeamStatus({ agents, tasks }: TeamStatusProps) {
  const getAgentTasks = (agentId: string) => {
    return tasks.filter((task) => task.assignee === agentId);
  };

  const getAgentInProgressTask = (agentId: string) => {
    return tasks.find(
      (task) => task.assignee === agentId && task.status === 'in_progress'
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {agents.map((agent) => {
        const agentTasks = getAgentTasks(agent.id);
        const inProgressTask = getAgentInProgressTask(agent.id);
        const completedCount = agentTasks.filter((t) => t.status === 'done').length;
        const inProgressCount = agentTasks.filter((t) => t.status === 'in_progress').length;
        const statusConfig = STATUS_CONFIG[agent.status];

        return (
          <div
            key={agent.id}
            className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-4px]"
          >
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface/90 to-deep/90 backdrop-blur-xl" />
            
            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl border border-elevated/50 group-hover:border-cyan/30 transition-colors" />
            
            {/* Holographic accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan/50 via-violet/50 to-magenta/50 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-6">
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  {/* Large avatar with glow */}
                  <div className="relative">
                    <div className="text-5xl filter drop-shadow-lg">
                      {agent.emoji}
                    </div>
                    {/* Status ring */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2 flex items-center justify-center`}>
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-success animate-pulse' : agent.status === 'working' ? 'bg-info animate-pulse' : agent.status === 'idle' ? 'bg-warning' : 'bg-text-muted'}`} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-wider text-text-primary">
                      {agent.name.toUpperCase()}
                    </h3>
                    <p className="font-mono text-xs text-cyan tracking-wider uppercase mt-0.5">
                      {agent.role}
                    </p>
                  </div>
                </div>
                
                {/* Status badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' || agent.status === 'working' ? 'animate-pulse' : ''} ${statusConfig.color.replace('text-', 'bg-')}`} />
                  <span className={`font-mono text-[10px] ${statusConfig.color} tracking-wider`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Focus */}
              <p className="font-body text-sm text-text-secondary mb-5">
                {agent.focus}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-abyss/50 border border-elevated/30 text-center">
                  <p className="font-display text-2xl font-bold text-text-primary">{agentTasks.length}</p>
                  <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mt-1">Assigned</p>
                </div>
                <div className="p-3 rounded-xl bg-success/5 border border-success/20 text-center">
                  <p className="font-display text-2xl font-bold text-success">{completedCount}</p>
                  <p className="font-mono text-[10px] text-success/70 tracking-wider uppercase mt-1">Done</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/5 border border-warning/20 text-center">
                  <p className="font-display text-2xl font-bold text-warning">{inProgressCount}</p>
                  <p className="font-mono text-[10px] text-warning/70 tracking-wider uppercase mt-1">Active</p>
                </div>
              </div>

              {/* Current Task */}
              <div className="mb-4">
                <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mb-2">
                  Current Mission
                </p>
                {inProgressTask ? (
                  <Link
                    href={`/tasks/${inProgressTask.id}`}
                    className="block p-4 rounded-xl bg-abyss/50 border border-warning/20 hover:border-warning/40 transition-colors group/task"
                  >
                    <p className="font-body text-sm font-medium text-text-primary line-clamp-2 group-hover/task:text-cyan-bright transition-colors">
                      {inProgressTask.title}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <PriorityBadge priority={inProgressTask.priority} size="sm" />
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-3 h-1 rounded-full bg-elevated/50 overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-warning to-cyan rounded-full loading-bar" />
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 rounded-xl bg-abyss/30 border border-elevated/20 text-center">
                    <svg className="w-8 h-8 mx-auto text-text-muted/50 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="font-mono text-xs text-text-muted italic">
                      Awaiting assignment
                    </p>
                  </div>
                )}
              </div>

              {/* Last Seen */}
              <div className="flex items-center justify-between pt-4 border-t border-elevated/30">
                <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
                  Last Ping
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {new Date(agent.lastSeen).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
            
            {/* Corner decoration */}
            <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="absolute bottom-[-12px] right-[-12px] w-24 h-24 border-4 border-cyan rounded-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

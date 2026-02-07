'use client';

import { AGENTS, AgentId, AgentStatus } from '@/lib/types';

interface AgentAvatarProps {
  agentId: AgentId | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: AgentStatus;
  showName?: boolean;
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  active: 'status-active',
  working: 'status-working',
  idle: 'status-idle',
  offline: 'status-offline',
};

export default function AgentAvatar({
  agentId,
  size = 'md',
  showStatus = false,
  status,
  showName = false,
}: AgentAvatarProps) {
  const agent = agentId ? AGENTS.find((a) => a.id === agentId) : null;

  const sizeConfig = {
    sm: { container: 'w-7 h-7', text: 'text-sm', statusDot: 'w-2 h-2 -bottom-0.5 -right-0.5', name: 'text-xs' },
    md: { container: 'w-9 h-9', text: 'text-lg', statusDot: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5', name: 'text-sm' },
    lg: { container: 'w-12 h-12', text: 'text-2xl', statusDot: 'w-3 h-3 -bottom-0.5 -right-0.5', name: 'text-base' },
    xl: { container: 'w-16 h-16', text: 'text-3xl', statusDot: 'w-4 h-4 bottom-0 right-0', name: 'text-lg' },
  };

  const config = sizeConfig[size];

  if (!agent) {
    return (
      <div
        className={`
          ${config.container} rounded-xl 
          bg-gradient-to-br from-elevated to-muted
          border border-elevated/50
          flex items-center justify-center 
          text-text-muted ${config.text}
        `}
        title="Unassigned"
      >
        <svg className="w-1/2 h-1/2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative group">
        {/* Avatar container */}
        <div
          className={`
            ${config.container} rounded-xl 
            bg-gradient-to-br from-surface to-deep
            border border-cyan/20 group-hover:border-cyan/40
            flex items-center justify-center 
            ${config.text}
            transition-all duration-300
            group-hover:shadow-glow-cyan/30
          `}
          title={`${agent.name} - ${agent.role}`}
        >
          {/* Emoji */}
          <span className="relative z-10">{agent.emoji}</span>
          
          {/* Subtle glow behind emoji */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan/5 to-violet/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Status indicator */}
        {showStatus && status && (
          <div
            className={`
              absolute ${config.statusDot}
              rounded-full ${STATUS_STYLES[status]}
              border-2 border-void
            `}
            title={status}
          />
        )}
        
        {/* Hover ring */}
        <div className="absolute -inset-1 rounded-xl bg-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
      </div>
      
      {showName && (
        <div className="flex flex-col">
          <span className={`font-body font-medium text-text-primary ${config.name}`}>
            {agent.name}
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
              {agent.role}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

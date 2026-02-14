"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAgentConfig } from "@/components/AgentConfigProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { brand } = useAgentConfig();

  const navItems = [
    { href: "/", label: "COMMAND", icon: CommandIcon },
    { href: "/team", label: "AGENTS", icon: AgentsIcon },
    { href: "/tasks/new", label: "DEPLOY", icon: DeployIcon },
  ];

  return (
    <nav className="relative z-50">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-abyss/80 backdrop-blur-xl border-b border-cyan-dim/20" />

      {/* Glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      <div className="relative px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Animated logo mark */}
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-void"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-lg bg-cyan-glow/30 animate-ping opacity-0 group-hover:opacity-100" />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider text-text-primary">
                {brand.name}
              </span>
              <span className="font-mono text-[10px] text-cyan tracking-[0.3em] uppercase">
                {brand.subtitle}
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-deep/50 border border-elevated/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-mono text-xs tracking-wider
                    transition-all duration-300 overflow-hidden
                    ${
                      isActive
                        ? "text-void bg-gradient-to-r from-cyan to-cyan-bright shadow-glow-cyan"
                        : "text-text-secondary hover:text-cyan-bright hover:bg-elevated/50"
                    }
                  `}>
                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/50" />
                  )}

                  <Icon className={`w-4 h-4 ${isActive ? "text-void" : ""}`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="font-mono text-[10px] text-success tracking-wider uppercase">
                ONLINE
              </span>
            </div>

            {/* Seed button */}
            {/* <button
              onClick={async () => {
                await fetch('/api/seed', { method: 'POST' });
                window.location.reload();
              }}
              className="group relative px-4 py-2 rounded-lg font-mono text-xs tracking-wider text-text-muted hover:text-cyan transition-colors overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                SEED
              </span>
              
              
              <span className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-violet/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Icon components
function CommandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AgentsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="19" cy="8" r="2" />
      <path d="M23 21v-1a3 3 0 00-2-2.83" />
      <circle cx="5" cy="8" r="2" />
      <path d="M1 21v-1a3 3 0 012-2.83" />
    </svg>
  );
}

function DeployIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2">
      <path
        d="M12 4v16m0-16l-4 4m4-4l4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4" y="18" width="16" height="2" rx="1" />
    </svg>
  );
}

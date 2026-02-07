"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SerializedAgent, SerializedTask } from "@/lib/types";
import TeamStatus from "@/components/TeamStatus";

export default function TeamPage() {
  const [agents, setAgents] = useState<SerializedAgent[]>([]);
  const [tasks, setTasks] = useState<SerializedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, tasksRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/tasks"),
        ]);

        const agentsData = await agentsRes.json();
        const tasksData = await tasksRes.json();

        if (agentsData.success) {
          setAgents(agentsData.agents);
        }
        if (tasksData.success) {
          setTasks(tasksData.tasks);
        }
      } catch (err) {
        setError("Failed to fetch team data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-6">
          <div className="cyber-spinner" />
          <div className="text-center">
            <p className="font-mono text-sm text-cyan tracking-wider uppercase">
              Syncing Agents
            </p>
            <p className="font-mono text-xs text-text-muted mt-1">
              Establishing neural link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-danger"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-2 tracking-wider">
            CONNECTION LOST
          </h2>
          <p className="font-body text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl btn-glow text-void font-mono text-sm tracking-wider uppercase">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Calculate team stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const activeAgents = agents.filter((a) => a.status !== "offline").length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan to-violet rounded-full" />
            <h1 className="font-display text-3xl font-bold tracking-wider text-text-primary">
              AGENT ROSTER
            </h1>
          </div>
          <p className="font-body text-text-secondary ml-5">
            Real-time status monitoring for your AI agent team
          </p>
        </div>

        {/* Team Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Agents */}
          <div className="relative group rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-deep" />
            <div className="absolute inset-0 rounded-2xl border border-elevated/50 group-hover:border-cyan/30 transition-colors" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyan"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                  </svg>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-text-primary">
                {agents.length}
              </p>
              <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mt-1">
                Total Agents
              </p>
            </div>
          </div>

          {/* Active Agents */}
          <div className="relative group rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-deep" />
            <div className="absolute inset-0 rounded-2xl border border-elevated/50 group-hover:border-success/30 transition-colors" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-success opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                  </div>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-success">
                {activeAgents}
              </p>
              <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mt-1">
                Online Now
              </p>
            </div>
          </div>

          {/* In Progress */}
          <div className="relative group rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-deep" />
            <div className="absolute inset-0 rounded-2xl border border-elevated/50 group-hover:border-warning/30 transition-colors" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-warning"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-warning">
                {inProgressTasks}
              </p>
              <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mt-1">
                Active Tasks
              </p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="relative group rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-deep" />
            <div className="absolute inset-0 rounded-2xl border border-elevated/50 group-hover:border-violet/30 transition-colors" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-violet-bright"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-display text-4xl font-bold text-violet-bright">
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </p>
              <p className="font-mono text-[10px] text-text-muted tracking-wider uppercase mt-1">
                Success Rate
              </p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="w-5 h-5 text-cyan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
            </svg>
            <h2 className="font-display text-lg font-semibold tracking-wider text-text-primary uppercase">
              Agent Network
            </h2>
          </div>
          <TeamStatus agents={agents} tasks={tasks} />
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="w-5 h-5 text-violet-bright"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="font-display text-lg font-semibold tracking-wider text-text-primary uppercase">
              Activity Stream
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface/80 to-deep/80 backdrop-blur-xl" />
            <div className="absolute inset-0 rounded-2xl border border-elevated/50" />

            <div className="relative p-6">
              {tasks
                .flatMap((task) =>
                  task.workLog.slice(-3).map((log) => ({
                    ...log,
                    taskId: task.id,
                    taskTitle: task.title,
                  })),
                )
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 10)
                .map((log, index) => (
                  <div
                    key={`${log.id}-${index}`}
                    className="flex items-start gap-4 py-4 border-b border-elevated/30 last:border-0 group">
                    {/* Status indicator */}
                    <div className="relative mt-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          log.action === "completed"
                            ? "bg-success shadow-glow-success"
                            : log.action === "blocked"
                              ? "bg-danger shadow-glow-danger"
                              : log.action === "picked"
                                ? "bg-info"
                                : "bg-text-muted"
                        }`}
                      />
                      {index < 9 && (
                        <div className="absolute top-4 left-1/2 w-px h-8 -translate-x-1/2 bg-gradient-to-b from-elevated/50 to-transparent" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-text-primary">
                        <span className="font-semibold text-cyan">
                          {log.agent}
                        </span>{" "}
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded ${
                            log.action === "completed"
                              ? "bg-success/10 text-success"
                              : log.action === "blocked"
                                ? "bg-danger/10 text-danger"
                                : log.action === "picked"
                                  ? "bg-info/10 text-info"
                                  : "bg-muted/50 text-text-muted"
                          }`}>
                          {log.action}
                        </span>{" "}
                        <Link
                          href={`/tasks/${log.taskId}`}
                          className="text-text-secondary hover:text-cyan-bright transition-colors">
                          {log.taskTitle}
                        </Link>
                      </p>
                      {log.note && (
                        <p className="font-body text-xs text-text-muted mt-1 line-clamp-2">
                          {log.note}
                        </p>
                      )}
                      <p className="font-mono text-[10px] text-text-muted/70 mt-2">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

              {tasks.flatMap((t) => t.workLog).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-elevated/50 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-text-muted"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5">
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-mono text-sm text-text-muted">
                    No activity recorded yet
                  </p>
                  <p className="font-body text-xs text-text-muted/70 mt-1">
                    Agent actions will appear here in real-time
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

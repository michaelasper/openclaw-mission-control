'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentConfig } from "@/components/AgentConfigProvider";
import { TaskPriority, AgentId } from '@/lib/types';

interface CreateTaskFormProps {
  onSuccess?: () => void;
}

export default function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const router = useRouter();
  const { agents } = useAgentConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    assignee: '' as AgentId | '',
    createdBy: '',
    tags: '',
    dueDate: '',
  });

  useEffect(() => {
    if (agents.length === 0) return;

    setFormData((prev) => {
      const validCreatedBy = agents.some((agent) => agent.id === prev.createdBy);
      const validAssignee =
        prev.assignee === "" || agents.some((agent) => agent.id === prev.assignee);

      return {
        ...prev,
        createdBy: validCreatedBy ? prev.createdBy : agents[0].id,
        assignee: validAssignee ? prev.assignee : "",
      };
    });
  }, [agents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.createdBy) {
      setError("No valid agents are configured");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignee: formData.assignee || null,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          dueDate: formData.dueDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-start gap-3">
          <svg className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="font-mono text-xs text-danger tracking-wider uppercase mb-1">Error</p>
            <p className="font-body text-sm text-danger/80">{error}</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
          Mission Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl cyber-input text-text-primary font-body"
          placeholder="Enter task title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
          Mission Brief <span className="text-danger">*</span>
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl cyber-input text-text-primary font-body resize-none"
          placeholder="Describe the task in detail"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
            Priority Level <span className="text-danger">*</span>
          </label>
          <select
            id="priority"
            required
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            className="w-full px-4 py-3 rounded-xl cyber-select text-text-primary font-body"
          >
            <option value="low">Low - Standard</option>
            <option value="medium">Medium - Elevated</option>
            <option value="high">High - Critical</option>
            <option value="urgent">Urgent - Immediate</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
            Assign Agent
          </label>
          <select
            id="assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value as AgentId | '' })}
            className="w-full px-4 py-3 rounded-xl cyber-select text-text-primary font-body"
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.emoji} {agent.name} - {agent.role}
              </option>
            ))}
          </select>
        </div>

        {/* Created By */}
        <div>
          <label htmlFor="createdBy" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
            Initiated By <span className="text-danger">*</span>
          </label>
          <select
            id="createdBy"
            required
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className="w-full px-4 py-3 rounded-xl cyber-select text-text-primary font-body"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.emoji} {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
            Deadline
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl cyber-input text-text-primary font-body"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block font-mono text-xs text-text-muted tracking-wider uppercase mb-2">
          Classification Tags
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-3 rounded-xl cyber-input text-text-primary font-body"
          placeholder="seo, marketing, content (comma separated)"
        />
        <p className="mt-2 font-mono text-[10px] text-text-muted">
          Separate multiple tags with commas
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-elevated/30">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl font-mono text-sm text-text-muted hover:text-text-primary hover:bg-elevated/50 transition-colors tracking-wider uppercase"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="relative px-8 py-3 rounded-xl btn-glow text-void font-mono text-sm font-semibold tracking-wider uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Deploying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m0-16l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Deploy Task
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

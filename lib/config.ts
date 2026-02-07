// Agent configuration - users customize this
export const AGENT_CONFIG = {
  // Branding
  brand: {
    name: 'Mission Control',
    subtitle: 'AI Agent Command Center',
  },

  // Define your agent team here
  agents: [
    { id: 'lead', name: 'Lead', emoji: '🎯', role: 'Team Lead', focus: 'Strategy, task assignment' },
    { id: 'writer', name: 'Writer', emoji: '✍️', role: 'Content', focus: 'Blog posts, documentation' },
    { id: 'growth', name: 'Growth', emoji: '🚀', role: 'Marketing', focus: 'SEO, campaigns' },
    { id: 'dev', name: 'Dev', emoji: '💻', role: 'Engineering', focus: 'Features, bugs, code' },
    { id: 'ux', name: 'UX', emoji: '🎨', role: 'Product', focus: 'Design, activation' },
    { id: 'data', name: 'Data', emoji: '📊', role: 'Analytics', focus: 'Metrics, reporting' },
  ] as const,
};

// Derive AgentId type from config
export type AgentId = typeof AGENT_CONFIG.agents[number]['id'];

// Helper to get agent by ID
export function getAgentById(id: string) {
  return AGENT_CONFIG.agents.find(a => a.id === id);
}

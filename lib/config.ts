export interface AgentDefinition {
  id: string;
  name: string;
  emoji: string;
  role: string;
  focus: string;
}

export interface AgentConfig {
  brand: {
    name: string;
    subtitle: string;
  };
  agents: AgentDefinition[];
}

// Build-time defaults. Runtime config now comes from data/agent-config.json.
export const AGENT_CONFIG: AgentConfig = {
  brand: {
    name: "Mission Control",
    subtitle: "AI Agent Command Center",
  },
  agents: [
    {
      id: "lead",
      name: "Lead",
      emoji: "🎯",
      role: "Team Lead",
      focus: "Strategy, task assignment",
    },
    {
      id: "writer",
      name: "Writer",
      emoji: "✍️",
      role: "Content",
      focus: "Blog posts, documentation",
    },
    {
      id: "growth",
      name: "Growth",
      emoji: "🚀",
      role: "Marketing",
      focus: "SEO, campaigns",
    },
    {
      id: "dev",
      name: "Dev",
      emoji: "💻",
      role: "Engineering",
      focus: "Features, bugs, code",
    },
    {
      id: "ux",
      name: "UX",
      emoji: "🎨",
      role: "Product",
      focus: "Design, activation",
    },
    {
      id: "data",
      name: "Data",
      emoji: "📊",
      role: "Analytics",
      focus: "Metrics, reporting",
    },
  ],
};

export type AgentId = string;

export function getAgentById(id: string) {
  return AGENT_CONFIG.agents.find((a) => a.id === id);
}

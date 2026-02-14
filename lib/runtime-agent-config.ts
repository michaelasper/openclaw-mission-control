import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { AGENT_CONFIG, AgentConfig, AgentDefinition, AgentId } from "./config";

const DATA_DIR = path.join(process.cwd(), "data");
const AGENT_CONFIG_FILE = path.join(DATA_DIR, "agent-config.json");

function getDefaultConfig(): AgentConfig {
  return {
    brand: { ...AGENT_CONFIG.brand },
    agents: AGENT_CONFIG.agents.map((agent) => ({ ...agent })),
  };
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAgent(raw: unknown): AgentDefinition | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Partial<AgentDefinition>;
  const id = normalizeString(candidate.id).toLowerCase();
  const name = normalizeString(candidate.name);
  const emoji = normalizeString(candidate.emoji);
  const role = normalizeString(candidate.role);
  const focus = normalizeString(candidate.focus);

  if (!id || !name || !emoji || !role || !focus) {
    return null;
  }

  if (!/^[a-z0-9_-]+$/.test(id)) {
    return null;
  }

  return { id, name, emoji, role, focus };
}

function normalizeConfig(raw: unknown): AgentConfig {
  const fallback = getDefaultConfig();

  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const candidate = raw as Partial<AgentConfig>;
  const brandName = normalizeString(candidate.brand?.name) || fallback.brand.name;
  const brandSubtitle =
    normalizeString(candidate.brand?.subtitle) || fallback.brand.subtitle;

  const parsedAgents = Array.isArray(candidate.agents)
    ? candidate.agents
        .map(normalizeAgent)
        .filter((agent): agent is AgentDefinition => agent !== null)
    : [];

  const uniqueAgents: AgentDefinition[] = [];
  const seen = new Set<string>();
  for (const agent of parsedAgents) {
    if (!seen.has(agent.id)) {
      seen.add(agent.id);
      uniqueAgents.push(agent);
    }
  }

  return {
    brand: { name: brandName, subtitle: brandSubtitle },
    agents: uniqueAgents.length > 0 ? uniqueAgents : fallback.agents,
  };
}

async function ensureAgentConfigFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(AGENT_CONFIG_FILE);
  } catch {
    await fs.writeFile(
      AGENT_CONFIG_FILE,
      JSON.stringify(getDefaultConfig(), null, 2),
      "utf-8",
    );
  }
}

export function getAgentConfigFilePath(): string {
  return AGENT_CONFIG_FILE;
}

export function normalizeAgentId(value: string): AgentId {
  return value.trim().toLowerCase();
}

export async function getRuntimeAgentConfig(): Promise<AgentConfig> {
  await ensureAgentConfigFile();

  try {
    const content = await fs.readFile(AGENT_CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(content);
    return normalizeConfig(parsed);
  } catch {
    const fallback = getDefaultConfig();
    await fs.writeFile(AGENT_CONFIG_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

export async function getRuntimeAgentIds(): Promise<AgentId[]> {
  const config = await getRuntimeAgentConfig();
  return config.agents.map((agent) => agent.id);
}

export async function isRuntimeAgentId(agentId: string): Promise<boolean> {
  const normalized = normalizeAgentId(agentId);
  const ids = await getRuntimeAgentIds();
  return ids.includes(normalized);
}

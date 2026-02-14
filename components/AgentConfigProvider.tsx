"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AGENT_CONFIG, AgentDefinition } from "@/lib/config";

interface AgentConfigContextValue {
  brand: {
    name: string;
    subtitle: string;
  };
  agents: AgentDefinition[];
  refresh: () => Promise<void>;
}

const AgentConfigContext = createContext<AgentConfigContextValue>({
  brand: AGENT_CONFIG.brand,
  agents: AGENT_CONFIG.agents,
  refresh: async () => {
    // no-op default
  },
});

const CONFIG_POLL_INTERVAL_MS = 5000;

function isSameBrand(
  left: AgentConfigContextValue["brand"],
  right: AgentConfigContextValue["brand"],
): boolean {
  return left.name === right.name && left.subtitle === right.subtitle;
}

function isSameAgents(
  left: AgentDefinition[],
  right: AgentDefinition[],
): boolean {
  if (left.length !== right.length) return false;

  for (let index = 0; index < left.length; index += 1) {
    const leftAgent = left[index];
    const rightAgent = right[index];
    if (
      leftAgent.id !== rightAgent.id ||
      leftAgent.name !== rightAgent.name ||
      leftAgent.emoji !== rightAgent.emoji ||
      leftAgent.role !== rightAgent.role ||
      leftAgent.focus !== rightAgent.focus
    ) {
      return false;
    }
  }

  return true;
}

export function AgentConfigProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState(AGENT_CONFIG.brand);
  const [agents, setAgents] = useState<AgentDefinition[]>(AGENT_CONFIG.agents);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      const data = await response.json();

      if (response.ok && data.success && data.config) {
        setBrand((previous) =>
          isSameBrand(previous, data.config.brand) ? previous : data.config.brand,
        );
        setAgents((previous) =>
          isSameAgents(previous, data.config.agents)
            ? previous
            : data.config.agents,
        );
      }
    } catch (error) {
      console.error("Failed to fetch runtime config:", error);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const interval = window.setInterval(() => {
      void refresh();
    }, CONFIG_POLL_INTERVAL_MS);

    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      brand,
      agents,
      refresh,
    }),
    [brand, agents, refresh],
  );

  return (
    <AgentConfigContext.Provider value={value}>
      {children}
    </AgentConfigContext.Provider>
  );
}

export function useAgentConfig() {
  return useContext(AgentConfigContext);
}

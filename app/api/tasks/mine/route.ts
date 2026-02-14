import { NextRequest, NextResponse } from 'next/server';
import { getTasksByAgent, serializeTask } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { getRuntimeAgentIds, normalizeAgentId } from "@/lib/runtime-agent-config";

export const dynamic = 'force-dynamic';

// GET /api/tasks/mine?agent=nova - Get tasks assigned to an agent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: agent' },
        { status: 400 }
      );
    }

    const agentId = normalizeAgentId(agent) as AgentId;
    const validAgents = new Set(await getRuntimeAgentIds());
    if (!validAgents.has(agentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid agent ID" },
        { status: 400 }
      );
    }

    const tasks = await getTasksByAgent(agentId);

    return NextResponse.json({
      success: true,
      agent: agentId,
      tasks: tasks.map(serializeTask),
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks for agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

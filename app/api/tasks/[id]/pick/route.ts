import { NextRequest, NextResponse } from 'next/server';
import { pickTask, serializeTask } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { getRuntimeAgentIds, normalizeAgentId } from "@/lib/runtime-agent-config";

export const dynamic = 'force-dynamic';

// POST /api/tasks/[id]/pick - Agent picks up a task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { agent } = body;

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: agent' },
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

    const task = await pickTask(params.id, agentId);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
      message: `Task picked up by ${agentId}`,
    });
  } catch (error) {
    console.error('Error picking task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to pick task' },
      { status: 500 }
    );
  }
}

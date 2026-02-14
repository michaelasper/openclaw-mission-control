import { NextRequest, NextResponse } from 'next/server';
import { logWork, serializeTask } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { getRuntimeAgentIds, normalizeAgentId } from "@/lib/runtime-agent-config";

export const dynamic = 'force-dynamic';

// POST /api/tasks/[id]/log - Agent logs work progress
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { agent, action, note } = body;

    if (!agent || !action || !note) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: agent, action, note' },
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

    // Validate action
    const validActions = ['progress', 'blocked'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    const task = await logWork(params.id, agentId, action, note);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
      message: 'Work logged successfully',
    });
  } catch (error) {
    console.error('Error logging work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log work' },
      { status: 500 }
    );
  }
}

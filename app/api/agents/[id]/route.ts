import { NextRequest, NextResponse } from 'next/server';
import { getAgent, updateAgent, serializeAgent } from '@/lib/local-storage';
import { AgentId, AgentStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/agents/[id] - Get agent details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate agent ID
    const validAgents = ['shri', 'leo', 'nova', 'pixel', 'cipher', 'echo', 'forge'];
    if (!validAgents.includes(params.id)) {
      return NextResponse.json(
        { success: false, error: `Invalid agent ID. Must be one of: ${validAgents.join(', ')}` },
        { status: 400 }
      );
    }

    const agent = await getAgent(params.id as AgentId);

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: serializeAgent(agent),
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/[id] - Update agent status/lastSeen
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate agent ID
    const validAgents = ['shri', 'leo', 'nova', 'pixel', 'cipher', 'echo', 'forge'];
    if (!validAgents.includes(params.id)) {
      return NextResponse.json(
        { success: false, error: `Invalid agent ID. Must be one of: ${validAgents.join(', ')}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, currentTask } = body;

    // Validate status if provided
    if (status) {
      const validStatuses = ['active', 'working', 'idle', 'offline'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const updateData: Partial<{
      status: AgentStatus;
      currentTask: string | null;
    }> = {};

    if (status !== undefined) updateData.status = status;
    if (currentTask !== undefined) updateData.currentTask = currentTask;

    const agent = await updateAgent(params.id as AgentId, updateData);

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: serializeAgent(agent),
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

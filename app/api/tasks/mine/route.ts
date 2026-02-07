import { NextRequest, NextResponse } from 'next/server';
import { getTasksByAgent, serializeTask } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/tasks/mine?agent=nova - Get tasks assigned to an agent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent') as AgentId | null;

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: agent' },
        { status: 400 }
      );
    }

    // Validate agent
    const validAgents = ['shri', 'leo', 'nova', 'pixel', 'cipher', 'echo', 'forge'];
    if (!validAgents.includes(agent)) {
      return NextResponse.json(
        { success: false, error: `Invalid agent. Must be one of: ${validAgents.join(', ')}` },
        { status: 400 }
      );
    }

    const tasks = await getTasksByAgent(agent);

    return NextResponse.json({
      success: true,
      agent,
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

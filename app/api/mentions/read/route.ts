import { NextRequest, NextResponse } from 'next/server';
import { markMentionsRead, markAllMentionsRead } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { AGENT_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

const VALID_AGENTS: AgentId[] = AGENT_CONFIG.agents.map(a => a.id);

// POST /api/mentions/read - Mark mentions as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, mentionIds, all } = body;

    // Validate agent parameter
    if (!agent || typeof agent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Agent is required' },
        { status: 400 }
      );
    }

    const agentId = agent.toLowerCase() as AgentId;
    if (!VALID_AGENTS.includes(agentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    // If 'all' is true, mark all mentions as read for the agent
    if (all === true) {
      await markAllMentionsRead(agentId);
      return NextResponse.json({
        success: true,
        message: `All mentions marked as read for ${agentId}`,
      });
    }

    // Otherwise, mark specific mentions as read
    if (!mentionIds || !Array.isArray(mentionIds) || mentionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Either mentionIds array or all: true is required' },
        { status: 400 }
      );
    }

    // Validate mentionIds are all strings
    if (!mentionIds.every((id: unknown) => typeof id === 'string')) {
      return NextResponse.json(
        { success: false, error: 'mentionIds must be an array of strings' },
        { status: 400 }
      );
    }

    await markMentionsRead(mentionIds);

    return NextResponse.json({
      success: true,
      message: `${mentionIds.length} mention(s) marked as read`,
    });
  } catch (error) {
    console.error('Error marking mentions as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark mentions as read' },
      { status: 500 }
    );
  }
}

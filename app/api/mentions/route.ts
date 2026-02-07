import { NextRequest, NextResponse } from 'next/server';
import { getMentionsForAgent, serializeMention } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { AGENT_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

const VALID_AGENTS: AgentId[] = AGENT_CONFIG.agents.map(a => a.id);

// GET /api/mentions?agent=leo - Get unread mentions for an agent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');

    // Validate agent parameter
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent parameter is required' },
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

    // Get unread mentions for the agent
    const mentions = await getMentionsForAgent(agentId, true);

    return NextResponse.json({
      success: true,
      mentions: mentions.map(serializeMention),
      count: mentions.length,
    });
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentions' },
      { status: 500 }
    );
  }
}

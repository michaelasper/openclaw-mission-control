import { NextRequest, NextResponse } from 'next/server';
import { getAgents, serializeAgent, seedAgents } from '@/lib/local-storage';

export const dynamic = 'force-dynamic';

// GET /api/agents - List all agents with status
export async function GET(request: NextRequest) {
  try {
    // Seed agents if none exist
    await seedAgents();
    
    const agents = await getAgents();

    return NextResponse.json({
      success: true,
      agents: agents.map(serializeAgent),
      count: agents.length,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

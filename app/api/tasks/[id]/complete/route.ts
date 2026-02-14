import { NextRequest, NextResponse } from 'next/server';
import { completeTask, serializeTask } from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { getRuntimeAgentIds, normalizeAgentId } from "@/lib/runtime-agent-config";
import { isGitHubPullRequestUrl } from '@/lib/github-pr';

export const dynamic = 'force-dynamic';

// POST /api/tasks/[id]/complete - Agent marks task as done
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { agent, note, deliverable, deliverables, pullRequest, pullRequests } = body;

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

    // Validate deliverable if provided (must be .md file) - backward compatibility
    if (deliverable && typeof deliverable === 'string' && !deliverable.endsWith('.md')) {
      return NextResponse.json(
        { success: false, error: 'Deliverable must be a .md file' },
        { status: 400 }
      );
    }

    // Validate deliverables array if provided (all must be .md files)
    if (deliverables && Array.isArray(deliverables)) {
      for (const d of deliverables) {
        if (typeof d === 'string' && !d.endsWith('.md')) {
          return NextResponse.json(
            { success: false, error: 'All deliverables must be .md files' },
            { status: 400 }
          );
        }
      }
    }

    // Validate single GitHub PR URL if provided (backward compatibility)
    if (pullRequest !== undefined && pullRequest !== null) {
      if (typeof pullRequest !== 'string' || !isGitHubPullRequestUrl(pullRequest)) {
        return NextResponse.json(
          { success: false, error: 'Pull request must be a valid GitHub PR URL' },
          { status: 400 }
        );
      }
    }

    // Validate array of GitHub PR URLs if provided
    if (pullRequests !== undefined) {
      if (!Array.isArray(pullRequests)) {
        return NextResponse.json(
          { success: false, error: 'pullRequests must be an array' },
          { status: 400 }
        );
      }

      for (const pr of pullRequests) {
        if (typeof pr !== 'string' || !isGitHubPullRequestUrl(pr)) {
          return NextResponse.json(
            { success: false, error: 'All pullRequests must be valid GitHub PR URLs' },
            { status: 400 }
          );
        }
      }
    }

    const task = await completeTask(
      params.id,
      agentId,
      note,
      deliverables,
      deliverable,
      pullRequests,
      pullRequest,
    );

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
      message: `Task completed by ${agentId}`,
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}

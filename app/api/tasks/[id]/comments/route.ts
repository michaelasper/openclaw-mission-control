import { NextRequest, NextResponse } from 'next/server';
import {
  getTask,
  addCommentWithId,
  parseMentions,
  createMention,
  serializeTask
} from '@/lib/local-storage';
import { AgentId } from '@/lib/types';
import { AGENT_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

const VALID_AGENTS: AgentId[] = AGENT_CONFIG.agents.map(a => a.id);

// POST /api/tasks/[id]/comments - Add a comment with @mentions
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { author, content } = body;

    // Validate author
    if (!author || typeof author !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Author is required' },
        { status: 400 }
      );
    }

    if (!VALID_AGENTS.includes(author.toLowerCase() as AgentId)) {
      return NextResponse.json(
        { success: false, error: 'Author must be a valid agent ID' },
        { status: 400 }
      );
    }

    // Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Content is required and must be non-empty' },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = await getTask(params.id);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Add the comment
    const result = await addCommentWithId(params.id, author.toLowerCase(), content);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to add comment' },
        { status: 500 }
      );
    }

    const { task: updatedTask, commentId } = result;

    // Parse mentions from content
    const mentionedAgents = parseMentions(content);

    // Create mention records for each mentioned agent
    for (const mentionedAgent of mentionedAgents) {
      await createMention({
        taskId: params.id,
        taskTitle: updatedTask.title,
        commentId,
        author: author.toLowerCase(),
        mentionedAgent,
        content,
      });
    }

    // Find the newly added comment
    const newComment = updatedTask.comments.find(c => c.id === commentId);

    return NextResponse.json({
      success: true,
      comment: newComment ? {
        id: newComment.id,
        author: newComment.author,
        content: newComment.content,
        createdAt: newComment.createdAt,
      } : null,
      mentions: mentionedAgents,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

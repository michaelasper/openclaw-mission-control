import { NextRequest, NextResponse } from 'next/server';
import { getTask, updateTask, deleteTask, serializeTask } from '@/lib/local-storage';
import { TaskStatus, TaskPriority, AgentId } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/tasks/[id] - Get task details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await getTask(params.id);
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, status, priority, assignee, tags, dueDate, deliverable, deliverables } = body;

    // Validate status if provided
    if (status && !['backlog', 'todo', 'in_progress', 'review', 'done'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority' },
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

    const updateData: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      assignee: AgentId | null;
      tags: string[];
      dueDate: Date | null;
      deliverable: string | null;
      deliverables: string[] | null;
    }> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (tags !== undefined) updateData.tags = tags;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (deliverable !== undefined) updateData.deliverable = deliverable;
    if (deliverables !== undefined) updateData.deliverables = deliverables;

    const task = await updateTask(params.id, updateData);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await getTask(params.id);
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    await deleteTask(params.id);

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

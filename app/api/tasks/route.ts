import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask, serializeTask } from '@/lib/local-storage';
import { TaskStatus, TaskPriority, AgentId } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/tasks - List all tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;
    const assignee = searchParams.get('assignee') as AgentId | null;
    const priority = searchParams.get('priority') as TaskPriority | null;

    const filters: { status?: TaskStatus; assignee?: AgentId; priority?: TaskPriority } = {};
    if (status) filters.status = status;
    if (assignee) filters.assignee = assignee;
    if (priority) filters.priority = priority;

    const tasks = await getTasks(Object.keys(filters).length > 0 ? filters : undefined);
    
    return NextResponse.json({
      success: true,
      tasks: tasks.map(serializeTask),
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, assignee, createdBy, tags, dueDate } = body;

    if (!title || !description || !priority || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, priority, createdBy' },
        { status: 400 }
      );
    }

    // Validate priority
    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority. Must be: low, medium, high, or urgent' },
        { status: 400 }
      );
    }

    const task = await createTask({
      title,
      description,
      priority,
      assignee: assignee || null,
      createdBy,
      tags: tags || [],
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      task: serializeTask(task),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

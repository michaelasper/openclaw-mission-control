"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  SerializedTask,
  TaskStatus,
  COLUMNS,
  AgentId,
  TaskPriority,
} from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import { TaskCardOverlay } from "./TaskCard";
import FilterBar from "./FilterBar";

interface KanbanBoardProps {
  initialTasks: SerializedTask[];
}

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<SerializedTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<SerializedTask | null>(null);
  const [filters, setFilters] = useState<{
    assignee: AgentId | "all";
    priority: TaskPriority | "all";
    search: string;
  }>({
    assignee: "all",
    priority: "all",
    search: "",
  });

  // Update tasks when initialTasks change (from real-time updates)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredTasks = tasks.filter((task) => {
    if (filters.assignee !== "all" && task.assignee !== filters.assignee)
      return false;
    if (filters.priority !== "all" && task.priority !== filters.priority)
      return false;
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const tasksByStatus = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = filteredTasks.filter(
        (task) => task.status === column.id,
      );
      return acc;
    },
    {} as Record<TaskStatus, SerializedTask[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping over a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: newStatus } : task,
        ),
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Determine new status
    let newStatus: TaskStatus | null = null;

    // Check if dropped over a column
    const isOverColumn = COLUMNS.some((col) => col.id === over.id);
    if (isOverColumn) {
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped over another task - find that task's status
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && newStatus !== task.status) {
      // Update task status via API
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          // Revert on error
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, status: task.status } : t,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to update task status:", error);
        // Revert on error
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: task.status } : t,
          ),
        );
      }
    }
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;

  return (
    <div className="flex flex-col h-full pt-2">
      {/* Header with stats */}
      {/* <div className="px-6 pt-10 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider text-text-primary">
              MISSION CONTROL
            </h1>
            <p className="font-mono text-xs text-text-muted tracking-wider mt-1">
              TASK ORCHESTRATION INTERFACE
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-success">
                  {completedTasks}
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted uppercase">
                Done
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-warning">
                  {inProgressTasks}
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted uppercase">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-cyan">
                  {totalTasks}
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted uppercase">
                Total
              </span>
            </div>
          </div>
        </div>
      </div> */}

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-5 min-w-max px-6 pt-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                status={column.id}
                tasks={tasksByStatus[column.id]}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask && <TaskCardOverlay task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { Task } from '../services/task.service';
import DroppableColumn from './DroppableColumn';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskMove?: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE', newOrder: number) => void;
}

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'DONE', title: 'Done', color: 'bg-green-100' },
] as const;

export default function KanbanBoard({ tasks, onTaskClick, onTaskEdit, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Safety check
  if (!tasks || !Array.isArray(tasks)) {
    console.warn('KanbanBoard: tasks is not an array', tasks);
    return <div className="text-center text-gray-500 p-4">No tasks available</div>;
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    console.log('KanbanBoard: Processing tasks:', tasks);
    console.log('KanbanBoard: Tasks count:', tasks.length);

    tasks.forEach((task) => {
      console.log('KanbanBoard: Processing task:', task.id, 'Status:', task.status);
      if (task.status && grouped[task.status]) {
        grouped[task.status].push(task);
      } else {
        console.warn('KanbanBoard: Task has invalid or missing status:', task.id, task.status);
        // Default to TODO if status is missing or invalid
        grouped['TODO'].push(task);
      }
    });

    // Sort tasks by order within each status
    Object.keys(grouped).forEach((status) => {
      grouped[status].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    console.log('KanbanBoard: Tasks grouped by status:', grouped);
    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === taskId);
    if (!draggedTask) return;

    // Check if dropped on a column (status change) or another task (reorder)
    const isColumn = ['TODO', 'IN_PROGRESS', 'DONE'].includes(overId);
    
    if (isColumn) {
      // Dropped on a column - change status
      const newStatus = overId as 'TODO' | 'IN_PROGRESS' | 'DONE';
      const columnTasks = tasksByStatus[newStatus] || [];
      const newOrder = columnTasks.length; // Add to end of column
      
      onTaskMove?.(taskId, newStatus, newOrder);
    } else {
      // Dropped on another task - reorder within same column or move to new column
      const targetTask = tasks.find((t) => t.id === overId);
      if (!targetTask) return;

      // If same status, reorder; if different, move and reorder
      if (draggedTask.status === targetTask.status) {
        // Reorder within same column
        const columnTasks = tasksByStatus[draggedTask.status] || [];
        const targetIndex = columnTasks.findIndex((t) => t.id === overId);
        onTaskMove?.(taskId, draggedTask.status, targetIndex);
      } else {
        // Move to new column
        const newColumnTasks = tasksByStatus[targetTask.status] || [];
        const targetIndex = newColumnTasks.findIndex((t) => t.id === overId);
        onTaskMove?.(taskId, targetTask.status, targetIndex);
      }
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Optional: Add visual feedback during drag
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-6 pb-4 w-full" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id] || [];

          return (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={columnTasks}
              onTaskClick={onTaskClick}
              onTaskEdit={onTaskEdit}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}


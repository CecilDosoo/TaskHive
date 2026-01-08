import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../services/task.service';
import SortableTaskCard from './SortableTaskCard';

interface DroppableColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
}

export default function DroppableColumn({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onTaskEdit,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column transition-all duration-300 flex-1 ${
        isOver ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''
      }`}
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color}`}></span>
          {title}
        </h3>
        <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext id={id} items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">No tasks</div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
                onEdit={() => onTaskEdit?.(task)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}


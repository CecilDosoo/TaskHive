import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import type { Task } from '../services/task.service';

interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: () => void;
}

export default function SortableTaskCard({ task, onClick, onEdit }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    // Disable dragging when clicking on buttons
    disabled: false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  // Create modified listeners that check for data-no-dnd attribute or button clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if clicking on edit button or its children
    if (target.closest('.edit-btn') || target.closest('[data-no-dnd="true"]') || target.closest('button')) {
      e.stopPropagation();
      return;
    }
    
    // Call the original listener for dragging
    if (listeners?.onPointerDown) {
      (listeners.onPointerDown as any)(e);
    }
  };

  const modifiedListeners = listeners ? {
    ...listeners,
    onPointerDown: handlePointerDown,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...modifiedListeners}
    >
      <TaskCard task={task} onClick={onClick} onEdit={onEdit} />
    </div>
  );
}
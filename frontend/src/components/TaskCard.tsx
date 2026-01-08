import type { Task } from '../services/task.service';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: () => void;
}

const priorityColors = {
  LOW: 'priority-badge priority-low',
  MEDIUM: 'priority-badge priority-medium',
  HIGH: 'priority-badge priority-high',
  URGENT: 'priority-badge priority-urgent',
};

export default function TaskCard({ task, onClick, onEdit }: TaskCardProps) {
  if (!task) {
    return null;
  }
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div
      onClick={onClick}
      className="task-card relative group"
      style={{
        borderLeftColor:
          task.priority === 'URGENT'
            ? '#EF4444'
            : task.priority === 'HIGH'
            ? '#F59E0B'
            : task.priority === 'MEDIUM'
            ? '#3B82F6'
            : '#9CA3AF',
        borderLeftWidth: '5px',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm flex-1">{task.title}</h4>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
          <button
            onClick={handleEditClick}
            className="edit-btn pulse-glow"
            title="Edit task ✏️"
            style={{ 
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 10,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            data-no-dnd="true"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {task.assignments && task.assignments.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignments.slice(0, 3).map((assignment) => (
                <div
                  key={assignment.id}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                  title={assignment.user.name}
                >
                  {assignment.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {task.assignments.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center border-2 border-white">
                  +{task.assignments.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {task.dueDate && (
          <span
            className={`text-xs ${
              isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
            }`}
          >
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
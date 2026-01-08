import { useActivityLogs } from '../hooks/useActivityLogs';
import type { ActivityLog } from '../services/activity.service';

interface ActivityLogProps {
  projectId: string;
  taskId?: string;
  limit?: number;
}

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    TASK_CREATED: '➕',
    TASK_UPDATED: '✏️',
    TASK_DELETED: '🗑️',
    TASK_ASSIGNED: '👤',
    TASK_UNASSIGNED: '👤❌',
    TASK_STATUS_CHANGED: '🔄',
    TASK_PRIORITY_CHANGED: '⚡',
    COMMENT_CREATED: '💬',
    COMMENT_UPDATED: '💬✏️',
    COMMENT_DELETED: '💬🗑️',
    ATTACHMENT_UPLOADED: '📎',
    ATTACHMENT_DELETED: '📎🗑️',
    PROJECT_CREATED: '📁',
    PROJECT_UPDATED: '📁✏️',
    PROJECT_DELETED: '📁🗑️',
    MEMBER_ADDED: '👥➕',
    MEMBER_REMOVED: '👥❌',
    MEMBER_ROLE_CHANGED: '👥🔄',
  };
  return iconMap[type] || '📝';
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function ActivityLog({ projectId, taskId, limit = 50 }: ActivityLogProps) {
  const { data, isLoading, error } = useActivityLogs(projectId, taskId, limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load activity logs
      </div>
    );
  }

  const logs = data?.logs || [];

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No activity logs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log: ActivityLog) => (
        <div
          key={log.id}
          className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl flex-shrink-0">{getActivityIcon(log.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap" style={{ gap: '0.5rem' }}>
              <span className="font-medium text-gray-900" style={{ marginRight: '0.25rem' }}>{log.user.name}</span>
              <span className="text-gray-600">{log.description}</span>
            </div>
            {log.task && (
              <div className="mt-1 text-sm text-gray-500">
                Task: <span className="font-medium">{log.task.title}</span>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-400">
              {formatTimeAgo(log.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}






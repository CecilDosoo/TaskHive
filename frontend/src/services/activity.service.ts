import api from '../config/api';

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  projectId: string;
  userId: string;
  taskId?: string;
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  task?: {
    id: string;
    title: string;
  };
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
}

export const activityService = {
  getActivityLogs: async (projectId: string, taskId?: string, limit?: number): Promise<ActivityLogsResponse> => {
    const params = new URLSearchParams();
    if (taskId) params.append('taskId', taskId);
    if (limit) params.append('limit', limit.toString());
    const query = params.toString();
    const response = await api.get(`/projects/${projectId}/activity${query ? `?${query}` : ''}`);
    return response.data;
  },
};






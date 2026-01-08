import api from '../config/api';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  order: number;
  projectId: string;
  taskListId?: string;
  createdAt: string;
  updatedAt: string;
  assignments: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  projectId: string;
  taskListId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  taskListId?: string;
  order?: number;
}

export const taskService = {
  createTask: async (data: CreateTaskData): Promise<{ task: Task }> => {
    const response = await api.post<{ task: Task }>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskData): Promise<{ task: Task }> => {
    const response = await api.put<{ task: Task }>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },

  assignTask: async (taskId: string, userId: string): Promise<{ assignment: any }> => {
    const response = await api.post<{ assignment: any }>(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },

  unassignTask: async (taskId: string, userId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/tasks/${taskId}/unassign`, { userId });
    return response.data;
  },
};









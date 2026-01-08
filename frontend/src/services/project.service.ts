import api from '../config/api';

import type { Task } from './task.service';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    userId: string;
    projectId: string;
    role: 'ADMIN' | 'MEMBER' | 'VIEWER';
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  taskLists?: Array<{
    id: string;
    name: string;
    order: number;
    tasks: Task[];
  }>;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}

export const projectService = {
  getProjects: async (): Promise<{ projects: Project[] }> => {
    const response = await api.get<{ projects: Project[] }>('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<{ project: Project; userRole?: string; permissions?: { canEdit: boolean; canDelete: boolean; canManageMembers: boolean } }> => {
    const response = await api.get<{ project: Project; userRole?: string; permissions?: { canEdit: boolean; canDelete: boolean; canManageMembers: boolean } }>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectData): Promise<{ project: Project }> => {
    const response = await api.post<{ project: Project }>('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: UpdateProjectData): Promise<{ project: Project }> => {
    const response = await api.put<{ project: Project }>(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  },
};


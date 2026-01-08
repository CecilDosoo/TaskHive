import api from '../config/api';

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export const commentService = {
  getComments: async (taskId: string): Promise<{ comments: Comment[] }> => {
    const response = await api.get<{ comments: Comment[] }>(`/comments/task/${taskId}`);
    return response.data;
  },

  createComment: async (taskId: string, data: CreateCommentData): Promise<{ comment: Comment }> => {
    const response = await api.post<{ comment: Comment }>(`/comments/task/${taskId}`, data);
    return response.data;
  },

  updateComment: async (id: string, data: UpdateCommentData): Promise<{ comment: Comment }> => {
    const response = await api.put<{ comment: Comment }>(`/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/comments/${id}`);
    return response.data;
  },
};









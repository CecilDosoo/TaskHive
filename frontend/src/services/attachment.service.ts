import api from '../config/api';

export interface Attachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  taskId: string;
  uploadedAt: string;
}

export const attachmentService = {
  getAttachments: async (taskId: string): Promise<{ attachments: Attachment[] }> => {
    const response = await api.get<{ attachments: Attachment[] }>(`/attachments/task/${taskId}`);
    return response.data;
  },

  uploadAttachment: async (taskId: string, file: File): Promise<{ attachment: Attachment }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ attachment: Attachment }>(
      `/attachments/task/${taskId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteAttachment: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/attachments/${id}`);
    return response.data;
  },

  getFileUrl: (fileUrl: string): string => {
    // Construct full URL for file access
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${fileUrl}`;
  },
};









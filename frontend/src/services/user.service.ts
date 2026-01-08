import api from '../config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const userService = {
  searchUsers: async (email: string): Promise<{ users: User[] }> => {
    const response = await api.get<{ users: User[] }>(`/users/search?email=${encodeURIComponent(email)}`);
    return response.data;
  },
};







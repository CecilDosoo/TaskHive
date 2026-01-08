import api from '../config/api';

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joinedAt: string;
}

export interface InviteMemberData {
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface UpdateMemberRoleData {
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export const memberService = {
  getProjectMembers: async (projectId: string): Promise<{ members: ProjectMember[] }> => {
    const response = await api.get<{ members: ProjectMember[] }>(`/members/project/${projectId}`);
    return response.data;
  },

  inviteMember: async (projectId: string, data: InviteMemberData): Promise<{ member: ProjectMember }> => {
    const response = await api.post<{ member: ProjectMember }>(`/members/project/${projectId}/invite`, data);
    return response.data;
  },

  updateMemberRole: async (projectId: string, userId: string, data: UpdateMemberRoleData): Promise<{ member: ProjectMember }> => {
    const response = await api.put<{ member: ProjectMember }>(`/members/project/${projectId}/member/${userId}`, data);
    return response.data;
  },

  removeMember: async (projectId: string, userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/members/project/${projectId}/member/${userId}`);
    return response.data;
  },

  leaveProject: async (projectId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/members/project/${projectId}/leave`);
    return response.data;
  },
};







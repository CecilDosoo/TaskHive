import { useQuery } from '@tanstack/react-query';
import { useProject } from './useProjects';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../services/member.service';

export interface ProjectPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;
  canAddComment: boolean;
  canDeleteOwnComment: boolean;
  canDeleteAnyComment: boolean;
  canUploadAttachment: boolean;
  canDeleteAttachment: boolean;
  userRole: UserRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isViewer: boolean;
}

export const useProjectPermissions = (projectId: string | undefined): ProjectPermissions => {
  const { user } = useAuth();
  const { data: projectData } = useProject(projectId);

  if (!projectId || !user || !projectData?.project) {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canManageMembers: false,
      canCreateTask: false,
      canEditTask: false,
      canDeleteTask: false,
      canAssignTask: false,
      canAddComment: false,
      canDeleteOwnComment: false,
      canDeleteAnyComment: false,
      canUploadAttachment: false,
      canDeleteAttachment: false,
      userRole: null,
      isOwner: false,
      isAdmin: false,
      isMember: false,
      isViewer: false,
    };
  }

  const project = projectData.project;
  const userRole = projectData.userRole as UserRole | null;
  const permissions = projectData.permissions;

  // Determine role flags
  const isOwner = userRole === 'OWNER';
  const isAdmin = userRole === 'ADMIN' || isOwner;
  const isMember = userRole === 'MEMBER' || isAdmin;
  const isViewer = userRole === 'VIEWER' || isMember;

  // Permission matrix based on role
  return {
    canView: isViewer,
    canEdit: permissions?.canEdit ?? false,
    canDelete: permissions?.canDelete ?? false,
    canManageMembers: permissions?.canManageMembers ?? false,
    canCreateTask: isMember,
    canEditTask: isMember,
    canDeleteTask: isMember,
    canAssignTask: isMember,
    canAddComment: isViewer,
    canDeleteOwnComment: isViewer,
    canDeleteAnyComment: isAdmin,
    canUploadAttachment: isMember,
    canDeleteAttachment: isMember,
    userRole,
    isOwner,
    isAdmin,
    isMember,
    isViewer,
  };
};







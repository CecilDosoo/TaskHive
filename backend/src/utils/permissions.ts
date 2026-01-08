import prisma from '../config/database';
import { UserRole } from '@prisma/client';

export type Permission = 
  | 'view_project'
  | 'edit_project'
  | 'delete_project'
  | 'manage_members'
  | 'create_task'
  | 'edit_task'
  | 'delete_task'
  | 'assign_task'
  | 'add_comment'
  | 'delete_own_comment'
  | 'delete_any_comment'
  | 'upload_attachment'
  | 'delete_attachment';

export interface UserProjectRole {
  role: UserRole | 'OWNER' | null;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isViewer: boolean;
}

/**
 * Get user's role in a project
 */
export async function getUserProjectRole(
  userId: string,
  projectId: string
): Promise<UserProjectRole> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        where: { userId },
      },
    },
  });

  if (!project) {
    return {
      role: null,
      isOwner: false,
      isAdmin: false,
      isMember: false,
      isViewer: false,
    };
  }

  // Check if user is owner
  if (project.ownerId === userId) {
    return {
      role: 'OWNER',
      isOwner: true,
      isAdmin: true,
      isMember: true,
      isViewer: true,
    };
  }

  // Check if user is a member
  const member = project.members[0];
  if (!member) {
    return {
      role: null,
      isOwner: false,
      isAdmin: false,
      isMember: false,
      isViewer: false,
    };
  }

  return {
    role: member.role,
    isOwner: false,
    isAdmin: member.role === 'ADMIN',
    isMember: member.role === 'MEMBER' || member.role === 'ADMIN',
    isViewer: member.role === 'VIEWER' || member.role === 'MEMBER' || member.role === 'ADMIN',
  };
}

/**
 * Check if user has a specific permission in a project
 */
export async function hasPermission(
  userId: string,
  projectId: string,
  permission: Permission
): Promise<boolean> {
  const userRole = await getUserProjectRole(userId, projectId);

  if (!userRole.role) {
    return false;
  }

  // Permission matrix
  const permissions: Record<Permission, (UserRole | 'OWNER')[]> = {
    view_project: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    edit_project: ['OWNER', 'ADMIN'],
    delete_project: ['OWNER'],
    manage_members: ['OWNER', 'ADMIN'],
    create_task: ['OWNER', 'ADMIN', 'MEMBER'],
    edit_task: ['OWNER', 'ADMIN', 'MEMBER'],
    delete_task: ['OWNER', 'ADMIN', 'MEMBER'],
    assign_task: ['OWNER', 'ADMIN', 'MEMBER'],
    add_comment: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    delete_own_comment: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    delete_any_comment: ['OWNER', 'ADMIN'],
    upload_attachment: ['OWNER', 'ADMIN', 'MEMBER'],
    delete_attachment: ['OWNER', 'ADMIN', 'MEMBER'],
  };

  const allowedRoles = permissions[permission];
  return allowedRoles.includes(userRole.role);
}

/**
 * Check if user can access a project (view or higher)
 */
export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'view_project');
}

/**
 * Check if user can edit project settings
 */
export async function canEditProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'edit_project');
}

/**
 * Check if user can delete project
 */
export async function canDeleteProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'delete_project');
}

/**
 * Check if user can manage members
 */
export async function canManageMembers(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'manage_members');
}

/**
 * Check if user can create tasks
 */
export async function canCreateTask(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'create_task');
}

/**
 * Check if user can edit tasks
 */
export async function canEditTask(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'edit_task');
}

/**
 * Check if user can delete tasks
 */
export async function canDeleteTask(
  userId: string,
  projectId: string
): Promise<boolean> {
  return hasPermission(userId, projectId, 'delete_task');
}

/**
 * Check if user can delete a specific comment
 * (own comment or has delete_any_comment permission)
 */
export async function canDeleteComment(
  userId: string,
  projectId: string,
  commentUserId: string
): Promise<boolean> {
  // Can delete own comment
  if (userId === commentUserId) {
    return hasPermission(userId, projectId, 'delete_own_comment');
  }
  // Can delete any comment if admin/owner
  return hasPermission(userId, projectId, 'delete_any_comment');
}







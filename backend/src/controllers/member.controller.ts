import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { canManageMembers, getUserProjectRole, canAccessProject } from '../utils/permissions';
import { UserRole } from '@prisma/client';
import { createNotification } from './notification.controller';
import { createActivityLog } from './activity.controller';

/**
 * Get all members of a project
 */
export const getProjectMembers = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const userId = req.userId!;

    // Check if user can access project
    if (!(await canAccessProject(userId, projectId))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Format response: owner + members (exclude owner from members list if they're also a member)
    const ownerId = project.owner.id;
    const members = [
      {
        id: project.owner.id,
        name: project.owner.name,
        email: project.owner.email,
        avatar: project.owner.avatar,
        role: 'OWNER' as const,
        joinedAt: project.createdAt,
      },
      // Filter out owner from members list to avoid duplicates
      ...project.members
        .filter((member) => member.user.id !== ownerId)
        .map((member) => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatar: member.user.avatar,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
    ];

    res.json({ members });
  } catch (error: any) {
    console.error('Get project members error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch project members' } });
  }
};

/**
 * Invite a user to a project
 */
export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const { userId: inviteUserId, role } = req.body;
    const userId = req.userId!;

    // Check if user can manage members
    if (!(await canManageMembers(userId, projectId))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Validate role
    if (!role || !['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid role' } });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: inviteUserId },
    });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Check if user is already owner
    if (project.ownerId === inviteUserId) {
      return res.status(400).json({ error: { message: 'User is already the project owner' } });
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: inviteUserId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: { message: 'User is already a project member' } });
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: inviteUserId,
        role: role as UserRole,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Create activity log
    await createActivityLog(
      'MEMBER_ADDED',
      `Added ${member.user.name} to project as ${role}`,
      projectId,
      userId,
      undefined,
      { memberId: inviteUserId, memberName: member.user.name, role }
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('member:added', {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
      role: member.role,
      joinedAt: member.joinedAt,
    });

    // Create notification for invited user
    const inviter = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (inviter) {
      await createNotification(
        inviteUserId,
        'Project Invitation',
        `${inviter.name} invited you to join project "${project.name}" as ${role}`,
        'project_invite',
        io
      );
    }

    res.status(201).json({ member });
  } catch (error: any) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: { message: 'Failed to invite member' } });
  }
};

/**
 * Update a member's role
 */
export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const memberUserId = req.params.userId as string;
    const { role } = req.body;
    const userId = req.userId!;

    // Check if user can manage members
    if (!(await canManageMembers(userId, projectId))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Validate role
    if (!role || !['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid role' } });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Check if trying to change owner's role
    if (project.ownerId === memberUserId) {
      return res.status(400).json({ error: { message: 'Cannot change owner role' } });
    }

    // Check if member exists
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: { message: 'Member not found' } });
    }

    const oldRole = member.role;

    // Update role
    const updatedMember = await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
      data: {
        role: role as UserRole,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Create activity log
    await createActivityLog(
      'MEMBER_ROLE_CHANGED',
      `Changed ${updatedMember.user.name}'s role from ${oldRole} to ${role}`,
      projectId,
      userId,
      undefined,
      { memberId: memberUserId, memberName: updatedMember.user.name, oldRole, newRole: role }
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('member:updated', {
      id: updatedMember.user.id,
      name: updatedMember.user.name,
      email: updatedMember.user.email,
      avatar: updatedMember.user.avatar,
      role: updatedMember.role,
    });

    // Create notification for user whose role was updated
    const updater = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (updater && memberUserId !== userId) {
      await createNotification(
        memberUserId,
        'Role Updated',
        `${updater.name} updated your role to ${role} in project "${project.name}"`,
        'role_updated',
        io
      );
    }

    res.json({ member: updatedMember });
  } catch (error: any) {
    console.error('Update member role error:', error);
    res.status(500).json({ error: { message: 'Failed to update member role' } });
  }
};

/**
 * Remove a member from a project
 */
export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const memberUserId = req.params.userId as string;
    const userId = req.userId!;

    // Check if user can manage members
    if (!(await canManageMembers(userId, projectId))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Check if trying to remove owner
    if (project.ownerId === memberUserId) {
      return res.status(400).json({ error: { message: 'Cannot remove project owner' } });
    }

    // Check if member exists
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: { message: 'Member not found' } });
    }

    const memberName = member.user.name;

    // Create activity log before deletion
    await createActivityLog(
      'MEMBER_REMOVED',
      `Removed ${memberName} from project`,
      projectId,
      userId,
      undefined,
      { memberId: memberUserId, memberName }
    );

    // Remove member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('member:removed', {
      id: member.user.id,
      name: member.user.name,
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error: any) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: { message: 'Failed to remove member' } });
  }
};

/**
 * Leave a project (remove yourself)
 */
export const leaveProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const userId = req.userId!;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Check if user is owner
    if (project.ownerId === userId) {
      return res.status(400).json({ error: { message: 'Project owner cannot leave project' } });
    }

    // Check if user is a member
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: { message: 'You are not a member of this project' } });
    }

    // Remove member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('member:left', {
      id: member.user.id,
      name: member.user.name,
    });

    res.json({ message: 'Left project successfully' });
  } catch (error: any) {
    console.error('Leave project error:', error);
    res.status(500).json({ error: { message: 'Failed to leave project' } });
  }
};


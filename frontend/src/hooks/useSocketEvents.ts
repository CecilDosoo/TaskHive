import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../services/task.service';
import type { Project } from '../services/project.service';

/**
 * Hook to listen for task-related Socket.IO events and update React Query cache
 */
export function useTaskEvents(projectId: string | undefined) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected || !projectId) return;

    // Join the project room
    socket.emit('join-project', projectId);
    console.log('📡 Joined project room:', projectId);

    // Listen for task events
    const handleTaskCreated = (task: Task) => {
      console.log('📨 Task created event:', task);
      // Invalidate project query to refetch with new task
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleTaskUpdated = (task: Task) => {
      console.log('📨 Task updated event:', task);
      // Update the cache optimistically
      queryClient.setQueryData(['project', projectId], (oldData: any) => {
        if (!oldData?.project) return oldData;

        const updatedProject = { ...oldData.project };
        
        // Update task in taskLists
        if (updatedProject.taskLists) {
          updatedProject.taskLists = updatedProject.taskLists.map((list: any) => ({
            ...list,
            tasks: list.tasks?.map((t: Task) => 
              t.id === task.id ? task : t
            ) || [],
          }));
        }

        // Update task in direct tasks array
        if (updatedProject.tasks) {
          updatedProject.tasks = updatedProject.tasks.map((t: Task) =>
            t.id === task.id ? task : t
          );
        }

        return { project: updatedProject };
      });
      
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleTaskDeleted = (data: { id: string }) => {
      console.log('📨 Task deleted event:', data);
      // Invalidate to refetch without deleted task
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleTaskAssigned = (assignment: any) => {
      console.log('📨 Task assigned event:', assignment);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleTaskUnassigned = (data: { taskId: string; userId: string }) => {
      console.log('📨 Task unassigned event:', data);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    // Comment event handlers
    const handleCommentCreated = (comment: any) => {
      console.log('📨 Comment created event:', comment);
      queryClient.invalidateQueries({ queryKey: ['comments', comment.taskId] });
    };

    const handleCommentUpdated = (comment: any) => {
      console.log('📨 Comment updated event:', comment);
      queryClient.invalidateQueries({ queryKey: ['comments', comment.taskId] });
    };

    const handleCommentDeleted = (data: { id: string; taskId: string }) => {
      console.log('📨 Comment deleted event:', data);
      queryClient.invalidateQueries({ queryKey: ['comments', data.taskId] });
    };

    // Attachment event handlers
    const handleAttachmentCreated = (attachment: any) => {
      console.log('📨 Attachment created event:', attachment);
      queryClient.invalidateQueries({ queryKey: ['attachments', attachment.taskId] });
    };

    const handleAttachmentDeleted = (data: { id: string; taskId: string }) => {
      console.log('📨 Attachment deleted event:', data);
      queryClient.invalidateQueries({ queryKey: ['attachments', data.taskId] });
    };

    // Member event handlers
    const handleMemberAdded = (member: any) => {
      console.log('📨 Member added event:', member);
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleMemberUpdated = (member: any) => {
      console.log('📨 Member updated event:', member);
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleMemberRemoved = (data: { id: string; name: string }) => {
      console.log('📨 Member removed event:', data);
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    const handleMemberLeft = (data: { id: string; name: string }) => {
      console.log('📨 Member left event:', data);
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    };

    // Register event listeners
    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);
    socket.on('task:assigned', handleTaskAssigned);
    socket.on('task:unassigned', handleTaskUnassigned);
    socket.on('comment:created', handleCommentCreated);
    socket.on('comment:updated', handleCommentUpdated);
    socket.on('comment:deleted', handleCommentDeleted);
    socket.on('attachment:created', handleAttachmentCreated);
    socket.on('attachment:deleted', handleAttachmentDeleted);
    socket.on('member:added', handleMemberAdded);
    socket.on('member:updated', handleMemberUpdated);
    socket.on('member:removed', handleMemberRemoved);
    socket.on('member:left', handleMemberLeft);

    // Cleanup: leave room and remove listeners
    return () => {
      socket.emit('leave-project', projectId);
      console.log('📡 Left project room:', projectId);
      
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
      socket.off('task:assigned', handleTaskAssigned);
      socket.off('task:unassigned', handleTaskUnassigned);
      socket.off('comment:created', handleCommentCreated);
      socket.off('comment:updated', handleCommentUpdated);
      socket.off('comment:deleted', handleCommentDeleted);
      socket.off('attachment:created', handleAttachmentCreated);
      socket.off('attachment:deleted', handleAttachmentDeleted);
      socket.off('member:added', handleMemberAdded);
      socket.off('member:updated', handleMemberUpdated);
      socket.off('member:removed', handleMemberRemoved);
      socket.off('member:left', handleMemberLeft);
    };
  }, [socket, isConnected, projectId, queryClient]);
}

/**
 * Hook to listen for project-related Socket.IO events and update React Query cache
 */
export function useProjectEvents() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProjectCreated = (project: Project) => {
      console.log('📨 Project created event:', project);
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const handleProjectUpdated = (project: Project) => {
      console.log('📨 Project updated event:', project);
      // Update both the list and individual project cache
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
    };

    const handleProjectDeleted = (data: { id: string }) => {
      console.log('📨 Project deleted event:', data);
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: ['project', data.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    // Register event listeners
    socket.on('project:created', handleProjectCreated);
    socket.on('project:updated', handleProjectUpdated);
    socket.on('project:deleted', handleProjectDeleted);

    // Cleanup: remove listeners
    return () => {
      socket.off('project:created', handleProjectCreated);
      socket.off('project:updated', handleProjectUpdated);
      socket.off('project:deleted', handleProjectDeleted);
    };
  }, [socket, isConnected, queryClient]);
}


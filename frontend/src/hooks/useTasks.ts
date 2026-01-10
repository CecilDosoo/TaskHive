import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, type CreateTaskData, type UpdateTaskData } from '../services/task.service';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => taskService.createTask(data),
    onSuccess: (response, variables) => {
      console.log('Task created successfully:', response);
      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Force refetch
      queryClient.refetchQueries({ queryKey: ['project', variables.projectId] });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      taskService.updateTask(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['project', response.task.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      // Invalidate all project queries since we don't know which project the task belonged to
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
      taskService.assignTask(taskId, userId),
    onSuccess: () => {
      // Invalidate all project queries to refresh task assignments
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
};

export const useUnassignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
      taskService.unassignTask(taskId, userId),
    onSuccess: () => {
      // Invalidate all project queries to refresh task assignments
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
};


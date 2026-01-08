import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService, type CreateCommentData, type UpdateCommentData } from '../services/comment.service';

export const useComments = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentService.getComments(taskId!),
    enabled: !!taskId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: CreateCommentData }) =>
      commentService.createComment(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentData }) =>
      commentService.updateComment(id, data),
    onSuccess: (response, variables) => {
      // Find the taskId from the comment
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};









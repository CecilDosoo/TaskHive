import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentService } from '../services/attachment.service';

export const useAttachments = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['attachments', taskId],
    queryFn: () => attachmentService.getAttachments(taskId!),
    enabled: !!taskId,
  });
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) =>
      attachmentService.uploadAttachment(taskId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attachments', variables.taskId] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attachmentService.deleteAttachment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
};









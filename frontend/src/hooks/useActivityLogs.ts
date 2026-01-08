import { useQuery } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';

export const useActivityLogs = (projectId: string | undefined, taskId?: string, limit?: number) => {
  return useQuery({
    queryKey: ['activityLogs', projectId, taskId, limit],
    queryFn: () => activityService.getActivityLogs(projectId!, taskId, limit),
    enabled: !!projectId,
  });
};






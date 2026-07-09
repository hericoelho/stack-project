import { useQuery } from '@tanstack/react-query';
import { bffApi } from '../../../apis/bff.api';
import { type Activity } from '../types/activity.types';

export const useGetActivities = () => {
  const { data, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await bffApi.get<Activity[]>('/activities');
      return response.data;
    },
  });

  return { activities: data || [], isLoading, error };

};

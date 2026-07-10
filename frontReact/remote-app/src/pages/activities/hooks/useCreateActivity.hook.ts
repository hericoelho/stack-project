import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bffApi } from '../../../apis/bff.api';
import { type Activity, type CreateActivityRequest } from '../types/activity.types';

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation<Activity, Error, CreateActivityRequest>({
    mutationFn: async (newActivity) => {
      const response = await bffApi.post<Activity>('/activities', newActivity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate('/remote/activities');
    },
  });

  return { createActivity: mutate, isPending, error };
};
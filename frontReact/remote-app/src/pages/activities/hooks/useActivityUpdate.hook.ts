import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActivityStream } from './useActivityStream.hook';
import type { Activity } from '../types/activity.types';

export function useActivityUpdate() {
  const queryClient = useQueryClient();
  const event = useActivityStream();

  useEffect(() => {
    if (event) {
      queryClient.setQueryData<Activity[]>(['activities'], (old) => {
        if (!old) return old;
        return old.map((activity) =>
          activity.id === event.activityId
            ? { ...activity, status: event.newStatus }
            : activity
        );
      });
    }
  }, [event, queryClient]);
}
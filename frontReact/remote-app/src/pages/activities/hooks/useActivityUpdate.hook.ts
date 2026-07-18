import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Activity, ActivityStatusMessage } from '../types/activity.types';
import { useSseContext } from '../../../contexts/SseContext';

export function useActivityUpdate() {
  const queryClient = useQueryClient();
  const event = useSseContext<ActivityStatusMessage>();

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
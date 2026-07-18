import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { STATUS_LABELS } from '../utils/activityLabels.util';
import type { ActivityStatus, ActivityStatusMessage } from '../types/activity.types';
import { useSseContext } from '../../../contexts/SseContext';

const STATUS_TOAST_STYLE: Record<ActivityStatus, string> = {
  PREPARING: 'bg-yellow-500',
  PLAN: 'bg-blue-500',
  DONE: 'bg-green-500',
};
export function useSseNotifications() {
  const event = useSseContext<ActivityStatusMessage>();
  const prevEventRef = useRef<ActivityStatusMessage | null>(null);

  useEffect(() => {
    if (!event) return;
    if (prevEventRef.current === event) return;
    prevEventRef.current = event;

    const statusLabel = STATUS_LABELS[event.newStatus];

    toast(`Atividade: ${event.title}`, {
      description: `Novo status: ${statusLabel}  •  ${event.timestamp}`,
      className: STATUS_TOAST_STYLE[event.newStatus],
      duration: 5000,
    });
  }, [event]);
}

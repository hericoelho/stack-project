import { useState, useEffect } from 'react';
import type { ActivityStatusMessage } from '../types/activity.types';

export function useActivityStream(): ActivityStatusMessage | null {
  const [event, setEvent] = useState<ActivityStatusMessage | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BFF_API_BASE_URL;
    const source = new EventSource(`${baseUrl}/activities/stream`);

    source.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as ActivityStatusMessage;
      setEvent(data);
    };

    source.onerror = () => {
      console.error('SSE connection error', source.readyState);
    };

    return () => source.close();
  }, []);

  return event;
}
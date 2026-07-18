import { useEffect, useState, type ReactNode } from "react";
import { SseContext } from "./SseContext";

interface SseProviderProps<T> {
  url: string;
  parseEvent: (raw: unknown) => T;
  children: ReactNode;
}

export function SseProvider<T>({ url, parseEvent, children }: SseProviderProps<T>) {
  const [event, setEvent] = useState<T | null>(null);

  useEffect(() => {
    const source = new EventSource(url);

    source.onmessage = (e: MessageEvent) => {
      try {
        const data = parseEvent(JSON.parse(e.data));
        setEvent(data);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    source.onerror = () => {
      console.error('SSE connection error', source.readyState);
    };

    return () => source.close();
  }, [url, parseEvent]);

  return (
    <SseContext.Provider value={event}>
      {children}
    </SseContext.Provider>
  );
}
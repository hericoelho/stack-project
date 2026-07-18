import { createContext, useContext } from 'react';

export const SseContext = createContext<unknown>(null);

export function useSseContext<T>(): T | null {
  return useContext(SseContext) as T | null;
}
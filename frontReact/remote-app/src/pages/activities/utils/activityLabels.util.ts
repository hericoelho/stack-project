import type { ActivityType, ActivityStatus } from '../types/activity.types';

export const TYPE_LABELS: Record<ActivityType, string> = {
  STUDY: 'Estudo',
  PROJECT: 'Projeto',
  READING: 'Leitura',
  EVENT: 'Evento',
};

export const STATUS_LABELS: Record<ActivityStatus, string> = {
  PREPARING: 'Preparando',
  PLAN: 'Planejado',
  DONE: 'Concluído',
};

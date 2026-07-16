import { useEffect } from 'react';
import { useGetActivities } from './hooks/useGetActivities.hook'
import { useActivityStream } from './hooks/use-activity-stream';

const STATUS_STYLES: Record<string, string> = {
  PREPARING: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/30',
  PLAN: 'bg-blue-100 text-blue-800 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30',
  DONE: 'bg-green-100 text-green-800 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500/30',
}

const STATUS_LABELS: Record<string, string> = {
  PREPARING: 'Preparando',
  PLAN: 'Planejado',
  DONE: 'Concluído',
}

const TYPE_LABELS: Record<string, string> = {
  STUDY: 'Estudo',
  PROJECT: 'Projeto',
  READING: 'Leitura',
  EVENT: 'Evento',
}

function ActivityList() {
  const { activities, isLoading, error } = useGetActivities()

  const event = useActivityStream();

  useEffect(() => {
    if (event) {
      console.log('[SSE] Activity status changed:', event);
      console.log(`[SSE] Atividade "${event.title}" (${event.activityId}) mudou para ${event.newStatus}`);
    }
  }, [event]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
        Lista de atividades
      </h1>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
          <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-16">Nenhuma atividade encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((activity) => {
            const badgeClass = STATUS_STYLES[activity.status] ?? 'bg-gray-100 text-gray-800 ring-gray-600/20 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-500/30'
            const label = STATUS_LABELS[activity.status] ?? activity.status

            return (
              <div
                key={activity.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                      {activity.title}
                    </h2>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                  <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-700 px-2 py-1 font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-600/30">
                    {TYPE_LABELS[activity.type] || activity.type}
                  </span>
                  <time>{activity.createdAt}</time>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActivityList

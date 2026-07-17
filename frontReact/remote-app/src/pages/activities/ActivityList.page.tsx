import { useGetActivities } from './hooks/useGetActivities.hook'
import { useActivityUpdate } from './hooks/useActivityUpdate.hook';
import { ActivityStatusBadge } from './components/ActivityStatusBadge';
import { ActivityTypeBadge } from './components/ActivityTypeBadge';

function ActivityList() {
  useActivityUpdate();
  const { activities, isLoading, error } = useGetActivities()

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
                    <ActivityStatusBadge status={activity.status} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                  <ActivityTypeBadge type={activity.type} />
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

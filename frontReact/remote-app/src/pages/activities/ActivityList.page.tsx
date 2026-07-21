import { useGetActivities } from './hooks/useGetActivities.hook'
import { useActivityUpdate } from './hooks/useActivityUpdate.hook';
import Error from '../../components/Erro';
import ActivityListEmptyState from './components/ActivityEmptyState';
import Loading from '../../components/Loading';
import ActivityCard from './components/ActivityCard';

function ActivityList() {
  useActivityUpdate();
  const { activities, isLoading, error } = useGetActivities()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
        Lista de atividades
      </h1>

      {error && <Error message={error.message} />}

      {isLoading ? (
        <Loading />
      ) : activities.length === 0 ? (
        <ActivityListEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityList

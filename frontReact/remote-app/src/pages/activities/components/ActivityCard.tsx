import type { Activity } from "../types/activity.types"
import { ActivityStatusBadge } from "./ActivityStatusBadge"
import { ActivityTypeBadge } from "./ActivityTypeBadge"

function ActivityCard({ key, activity }: { key: string; activity: Activity }) {
  return (
     <div
    key={key}
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
}

export default ActivityCard

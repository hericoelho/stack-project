import type { ActivityType } from "../types/activity.types";
import { TYPE_LABELS } from "../utils/activityLabels.util";

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-700 px-2 py-1 font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-600/30">
      {TYPE_LABELS[type] || type}
    </span>
  );
}
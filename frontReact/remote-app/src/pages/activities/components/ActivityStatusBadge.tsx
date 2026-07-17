import type { ActivityStatus } from "../types/activity.types";
import { STATUS_LABELS } from "../utils/activityLabels.util";

const STATUS_STYLES: Record<ActivityStatus, string> = {
  PREPARING: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20 ...',
  PLAN: 'bg-blue-100 text-blue-800 ring-blue-600/20 ...',
  DONE: 'bg-green-100 text-green-800 ring-green-600/20 ...',
};

interface ActivityStatusBadgeProps {
  status: ActivityStatus;
}

export function ActivityStatusBadge({ status }: ActivityStatusBadgeProps) {
  const badgeClass = STATUS_STYLES[status];
  const label = STATUS_LABELS[status];

  return (
    <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClass}`}>
      {label}
    </span>
  );
}

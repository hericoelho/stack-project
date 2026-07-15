import { ActivityStatus } from '../dto/enum/activity-status.enum';

export interface ActivityStatusMessage {
  activityId: string;
  title: string;
  newStatus: ActivityStatus;
  timestamp: string;
}

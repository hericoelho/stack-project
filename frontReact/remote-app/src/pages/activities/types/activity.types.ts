export interface Activity {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus
  type: ActivityType
  createdAt: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  type: ActivityType
}

export interface ActivityStatusMessage {
  activityId: string;
  title: string;
  newStatus: ActivityStatus
  timestamp: string;
}

export type ActivityStatus = 'PREPARING' | 'PLAN' | 'DONE';
export type ActivityType = 'STUDY' | 'PROJECT' | 'READING' | 'EVENT';
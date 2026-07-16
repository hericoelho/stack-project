export interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'PREPARING' | 'PLAN' | 'DONE';
  type: 'STUDY' | 'PROJECT' | 'READING' | 'EVENT';
  createdAt: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  type: 'STUDY' | 'PROJECT' | 'READING' | 'EVENT';
}

export interface ActivityStatusMessage {
  activityId: string;
  title: string;
  newStatus: 'PREPARING' | 'PLAN' | 'DONE';
  timestamp: string;
}

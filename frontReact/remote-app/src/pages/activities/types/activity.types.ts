export interface Activity {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  type: string;
}
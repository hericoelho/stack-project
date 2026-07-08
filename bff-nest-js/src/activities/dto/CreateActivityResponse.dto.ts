import { ActivityStatus } from './enum/activity-status.enum';
import { ActivityType } from './enum/activity-type.enum';

export class CreateActivityResponseDto {
  id!: string;
  title!: string;
  description!: string;
  type!: ActivityType;
  status!: ActivityStatus;
  createdAt!: string;
}

import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ActivityStatusMessage } from '../rabbitmq/activity-status-message.interface';

@Injectable()
export class ActivityEventService {
  private readonly subject = new Subject<ActivityStatusMessage>();

  emit(message: ActivityStatusMessage): void {
    this.subject.next(message);
  }

  get events$(): Observable<ActivityStatusMessage> {
    return this.subject.asObservable();
  }
}

import { Controller, Header, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ActivityEventService } from './events/activity-event.service';
import { formatDate } from './utils/date-formatter.util';

@Controller('activities')
export class ActivitiesSseController {
  constructor(private readonly eventService: ActivityEventService) {}

  @Header('Cache-Control', 'no-cache')
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.eventService.events$.pipe(
      map(
        (msg) =>
          ({
            data: { ...msg, timestamp: formatDate(msg.timestamp) },
          }) as MessageEvent,
      ),
    );
  }
}

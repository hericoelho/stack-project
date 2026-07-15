import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesMicroserviceClient } from './client/back-spring-microservice.client';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { ActivityEventService } from './events/activity-event.service';
import { ActivitiesSseController } from './activities-sse.controller';
@Module({
  imports: [HttpModule],
  controllers: [ActivitiesController, ActivitiesSseController],
  providers: [
    ActivitiesService,
    ActivitiesMicroserviceClient,
    RabbitmqService,
    ActivityEventService,
  ],
})
export class ActivitiesModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesMicroserviceClient } from './client/back-spring-microservice.client';

@Module({
  imports: [HttpModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesMicroserviceClient],
})
export class ActivitiesModule {}

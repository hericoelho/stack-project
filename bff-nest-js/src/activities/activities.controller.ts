import { Controller, Post, Body, Get } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityRequestDto } from './dto/CreateActivityRequest.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async create(@Body() createActivityRequestDto: CreateActivityRequestDto) {
    return await this.activitiesService.createActivity(
      createActivityRequestDto,
    );
  }

  @Get()
  async getActivities() {
    return await this.activitiesService.getActivities();
  }
}

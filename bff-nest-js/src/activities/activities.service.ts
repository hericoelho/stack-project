import { Injectable } from '@nestjs/common';
import { ActivitiesMicroserviceClient } from './client/back-spring-microservice.client';
import { CreateActivityRequestDto } from './dto/CreateActivityRequest.dto';
import { CreateActivityResponseDto } from './dto/CreateActivityResponse.dto';
import { CreateActivityDto } from './dto/ActivityResponse.dto';
import { formatDate } from './utils/date-formatter.util';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly microserviceClient: ActivitiesMicroserviceClient,
  ) {}

  createActivity(
    createActivityDto: CreateActivityRequestDto,
  ): Promise<CreateActivityResponseDto> {
    return this.microserviceClient
      .sendCreateActivity(createActivityDto)
      .then((dto) => this.toActivityResponse(dto));
  }

  async getActivities(): Promise<CreateActivityResponseDto[]> {
    const activities = await this.microserviceClient.getActivities();
    return activities.map((dto) => this.toActivityResponse(dto));
  }

  private toActivityResponse(
    dto: CreateActivityResponseDto,
  ): CreateActivityDto {
    return {
      ...dto,
      createdAt: formatDate(dto.createdAt),
    };
  }
}

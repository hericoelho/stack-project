import { Injectable } from '@nestjs/common';
import { ActivitiesMicroserviceClient } from './client/back-spring-microservice.client';
import { CreateActivityRequestDto } from './dto/CreateActivityRequest.dto';
import { CreateActivityResponseDto } from './dto/CreateActivityResponse.dto';
import { CreateActivityDto } from './dto/ActivityResponse.dto';

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
      createdAt: this.formatDate(dto.createdAt),
    };
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

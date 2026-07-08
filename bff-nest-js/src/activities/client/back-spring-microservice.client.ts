import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateActivityRequestDto } from '../dto/CreateActivityRequest.dto';
import { CreateActivityResponseDto } from '../dto/CreateActivityResponse.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActivitiesMicroserviceClient {
  private readonly apiPath: string = '/v1/activities';
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get(
      'BACKEND_BASE_URL',
      'http://localhost:8080/api',
    );
  }

  async sendCreateActivity(
    dto: CreateActivityRequestDto,
  ): Promise<CreateActivityResponseDto> {
    try {
      const baseUrl = `${this.baseUrl}${this.apiPath}`;
      const response = await firstValueFrom(
        this.httpService.post<CreateActivityResponseDto>(baseUrl, dto),
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Error on calling the activities microservice: Create Activity',
        message,
      );
    }
  }

  async getActivities(): Promise<CreateActivityResponseDto[]> {
    try {
      const baseUrl = `${this.baseUrl}${this.apiPath}`;
      const response = await firstValueFrom(
        this.httpService.get<CreateActivityResponseDto[]>(baseUrl),
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Error on calling the activities microservice: Get Activities',
        message,
      );
    }
  }
}

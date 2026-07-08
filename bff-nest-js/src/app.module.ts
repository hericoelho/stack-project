import { Module } from '@nestjs/common';
import { ActivitiesModule } from './activities/activities.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ActivitiesModule,
  ],
})
export class AppModule {}

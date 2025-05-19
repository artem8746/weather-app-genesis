import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import { WeatherModule } from './weather/weather.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SubscriptionModule,
    WeatherModule,
    EmailModule,
    ScheduleModule.forRoot(),
    JobsModule,
  ],
})
export class AppModule {}

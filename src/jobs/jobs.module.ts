import { EmailModule } from '@/email/email.module';
import { SubscriptionModule } from '@/subscription/subscription.module';
import { WeatherModule } from '@/weather/weather.module';
import { Module } from '@nestjs/common';
import { ForecastJobService } from './weather/weather-forecast.job';

@Module({
  imports: [WeatherModule, EmailModule, SubscriptionModule],
  providers: [ForecastJobService],
  exports: [ForecastJobService],
})
export class JobsModule {}

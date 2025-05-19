import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailModule } from '@/email/email.module';
import { WeatherModule } from '@/weather/weather.module';

@Module({
  imports: [EmailModule, WeatherModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}

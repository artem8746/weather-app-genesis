import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, PrismaService],
  exports: [WeatherService],
})
export class WeatherModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { WeatherApiResponse } from './types/weather-api-response';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  private readonly API_KEY = process.env.WEATHER_API_KEY;
  private readonly BASE_URL = process.env.WEATHER_API_URL;

  async getWeather(query: WeatherDto): Promise<WeatherApiResponse> {
    const url = `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${query.city}&aqi=no`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );

      return response.data;
    } catch {
      throw new NotFoundException('City not found');
    }
  }

  async isCityValid(city: string): Promise<boolean> {
    const url = `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${city}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );

      return response.data.current !== undefined;
    } catch {
      throw new NotFoundException('City not found');
    }
  }
}

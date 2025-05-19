import { ApiProperty } from '@nestjs/swagger';
import { WeatherApiResponse } from '../types/weather-api-response';

export class WeatherResponseDto {
  @ApiProperty({
    description: 'Temperature in Celsius',
    example: 15,
    type: Number,
  })
  temperature: number;

  @ApiProperty({
    description: 'Weather description',
    example: 'Clear sky',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Humidity percentage',
    example: 60,
    type: Number,
  })
  humidity: number;

  constructor(data: WeatherApiResponse) {
    this.description = data.current.condition.text;
    this.temperature = data.current.temp_c;
    this.humidity = data.current.humidity;
  }
}

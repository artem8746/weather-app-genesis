import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponses } from '@/common/utils/swagger.decorators';
import { WeatherDto } from './dto/weather.dto';
import { WeatherResponseDto } from './response/weather.response.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({ summary: 'Get weather for specified city' })
  @CommonResponses.ApiResponseBadRequest
  @CommonResponses.ApiResponseNotFound
  @CommonResponses.ApiResponseGetWeather
  @Get('/')
  public async confirm(
    @Query(new ValidationPipe()) query: WeatherDto,
  ): Promise<WeatherResponseDto> {
    const response = await this.weatherService.getWeather(query);

    return new WeatherResponseDto(response);
  }
}

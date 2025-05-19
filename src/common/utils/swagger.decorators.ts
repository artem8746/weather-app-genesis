import { WeatherResponseDto } from '@/weather/response/weather.response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const CommonResponses = {
  ApiResponseBadRequest: ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  }),

  ApiResponseConflict: ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
  }),

  ApiResponseNotFound: ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  }),

  ApiResponseOk: ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  }),

  ApiResponseSubscribe: ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscribe',
  }),

  ApiResponseGetWeather: ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Weather',
    type: WeatherResponseDto,
  }),
};

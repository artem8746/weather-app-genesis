import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import * as escapeHtml from 'escape-html';

export class WeatherDto {
  @ApiProperty({
    description: 'City for which to get the weather',
    example: 'London',
    type: String,
  })
  @IsString({
    message: 'City must be a string',
  })
  @IsNotEmpty({
    message: 'City must not be empty',
  })
  @Transform(({ value }) => escapeHtml(value))
  city: string;
}

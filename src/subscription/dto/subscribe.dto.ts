import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as escapeHtml from 'escape-html';
import { Frequency } from '@prisma/client';

export class SubscribeDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'example@example.com',
    type: String,
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsNotEmpty({
    message: 'Email must not be empty',
  })
  @IsEmail()
  @Transform(({ value }) => escapeHtml(value))
  email: string;

  @ApiProperty({
    description: 'City for the subscription',
    example: 'Washington',
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

  @ApiProperty({
    description: 'Frequency of the subscription',
    example: Frequency.DAILY,
    enum: Frequency,
  })
  @IsString({
    message: 'Frequency must be a string',
  })
  @IsNotEmpty({
    message: 'Frequency must not be empty',
  })
  @Transform(({ value }) => escapeHtml(value.toUpperCase()))
  @IsEnum(Frequency, {
    message: `Frequency must be one of the following: ${Object.values(Frequency).join(', ')}`,
  })
  frequency: Frequency;
}

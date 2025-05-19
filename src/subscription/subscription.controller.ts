import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponses } from '@/common/utils/swagger.decorators';
import { SubscribeDto } from './dto/subscribe.dto';

@ApiTags('Subscription')
@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Subscribe' })
  @CommonResponses.ApiResponseBadRequest
  @CommonResponses.ApiResponseConflict
  @CommonResponses.ApiResponseSubscribe
  @Post('/subscribe')
  public subscribe(
    @Body(new ValidationPipe({ whitelist: true })) query: SubscribeDto,
  ) {
    return this.subscriptionService.subscribe(query);
  }

  @ApiOperation({ summary: 'Confirm' })
  @CommonResponses.ApiResponseBadRequest
  @CommonResponses.ApiResponseNotFound
  @CommonResponses.ApiResponseOk
  @Get('/confirm/:token')
  public confirm(@Param('token') token: string) {
    return this.subscriptionService.confirm(token);
  }

  @ApiOperation({ summary: 'Unsubscribe' })
  @CommonResponses.ApiResponseBadRequest
  @CommonResponses.ApiResponseNotFound
  @CommonResponses.ApiResponseOk
  @Get('/unsubscribe/:token')
  public unsubscribe(@Param('token') token: string) {
    return this.subscriptionService.unsubscribe(token);
  }
}

import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { EmailService } from '@/email/email.service';
import { WeatherService } from '@/weather/weather.service';
import { v4 as uuidv4 } from 'uuid';
import { addHours, isBefore } from 'date-fns';
import { Frequency } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
  ) {}

  async subscribe(query: SubscribeDto) {
    const existingSubscription =
      await this.prismaService.subscription.findFirst({
        where: {
          email: query.email,
        },
      });

    if (existingSubscription && existingSubscription.startDate) {
      throw new ConflictException('Email already subscribed');
    }

    const isCityValid = await this.weatherService.isCityValid(query.city);

    if (!isCityValid) {
      throw new BadRequestException('Invalid input');
    }

    const token = uuidv4();

    const emailSent = await this.emailService.sendConfirmEmail(query.email, {
      city: query.city,
      code: token,
      confirmUrl: `${process.env.APP_URL}/confirm/${token}`,
    });

    if (!emailSent) {
      throw new BadRequestException('Invalid input');
    }

    if (existingSubscription) {
      await this.prismaService.subscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          token,
          tokenExpiry: addHours(new Date(), 24),
          frequency: query.frequency,
          city: query.city,
        },
      });

      return 'Subscription successful. Confirmation email sent.';
    }

    const subscription = await this.prismaService.subscription.create({
      data: {
        email: query.email,
        city: query.city,
        token,
        tokenExpiry: addHours(new Date(), 24),
        frequency: query.frequency,
      },
    });

    if (!subscription) {
      throw new BadRequestException('Invalid input');
    }

    return 'Subscription successful. Confirmation email sent.';
  }

  async confirm(token: string) {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        token,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    if (
      !subscription.tokenExpiry ||
      isBefore(subscription.tokenExpiry, new Date())
    ) {
      throw new BadRequestException('Invalid token');
    }

    const unsubscribeToken = uuidv4();

    await this.emailService.sendConfirmedEmail(subscription.email, {
      city: subscription.city,
      frequency: subscription.frequency.toLowerCase(),
      unsubscribeUrl: `${process.env.APP_URL}/unsubscribe/${unsubscribeToken}`,
      email: subscription.email,
    });

    await this.prismaService.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        startDate: new Date(),
        token: unsubscribeToken,
      },
    });

    return 'Subscription confirmed successfully';
  }

  async unsubscribe(token: string) {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        token,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.emailService.sendUnsubscribedEmail(subscription.email, {
      city: subscription.city,
      frequency: subscription.frequency.toLowerCase(),
      email: subscription.email,
    });

    await this.prismaService.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        endDate: new Date(),
        startDate: null,
        tokenExpiry: null,
        token: null,
      },
    });

    return 'Unsubscribed successfully';
  }

  async getHourlySubscribers() {
    return this.prismaService.subscription.findMany({
      where: { frequency: Frequency.HOURLY, startDate: { not: null } },
      select: { email: true, city: true, token: true },
    });
  }

  async getDailySubscribers() {
    return this.prismaService.subscription.findMany({
      where: { frequency: Frequency.DAILY, startDate: { not: null } },
      select: { email: true, city: true, token: true },
    });
  }
}

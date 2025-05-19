import { Injectable } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';
import { EMAIL_TEMPLATES } from './constants/templates';

export interface EmailData {
  to: string;
  subject: string;
  templateName: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class EmailService {
  constructor(private readonly sendGridService: SendGridService) {}

  async sendConfirmEmail(
    to: string,
    context: { city: string; confirmUrl: string; code: string },
  ) {
    await this.sendGridService.sendTemplateEmail({
      to,
      subject: 'Confirm your email',
      templateName: EMAIL_TEMPLATES.confirmSubscription,
      context: context,
    });

    return true;
  }

  async sendConfirmedEmail(
    to: string,
    context: {
      unsubscribeUrl: string;
      frequency: string;
      email: string;
      city: string;
    },
  ) {
    await this.sendGridService.sendTemplateEmail({
      to,
      subject: 'Email confirmed',
      templateName: EMAIL_TEMPLATES.emailConfirmed,
      context: context,
    });

    return true;
  }

  async sendUnsubscribedEmail(
    to: string,
    context: {
      frequency: string;
      email: string;
      city: string;
    },
  ) {
    await this.sendGridService.sendTemplateEmail({
      to,
      subject: 'Email unsubscribed',
      templateName: EMAIL_TEMPLATES.unsubscribedEmail,
      context: context,
    });

    return true;
  }

  async sendWeatherForecastEmail(
    to: string,
    context: {
      city: string;
      icon: string;
      description: string;
      temperature: string;
      feelsLike: string;
      humidity: string;
      year: string;
      unsubscribeUrl: string;
    },
  ) {
    await this.sendGridService.sendTemplateEmail({
      to,
      subject: 'Weather forecast',
      templateName: EMAIL_TEMPLATES.weatherForecast,
      context: context,
    });

    return true;
  }
}

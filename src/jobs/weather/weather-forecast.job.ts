import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from '../../subscription/subscription.service';
import { WeatherService } from '@/weather/weather.service';
import { EmailService } from '@/email/email.service';

@Injectable()
export class ForecastJobService {
  private readonly logger = new Logger(ForecastJobService.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly weatherService: WeatherService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendHourlyForecasts() {
    const hourlySubs = await this.subscriptionService.getHourlySubscribers();
    await this.sendForecasts(hourlySubs);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyForecasts() {
    const dailySubs = await this.subscriptionService.getDailySubscribers();
    await this.sendForecasts(dailySubs);
  }

  private async sendForecasts(
    subscribers: { email: string; city: string; token: string | null }[],
  ) {
    await Promise.all(
      subscribers.map(async (sub) => {
        try {
          const weather = await this.weatherService.getWeather({
            city: sub.city,
          });

          const iconUrl = `https:${weather.current.condition.icon}`;
          const context = {
            city: weather.location.name,
            temperature: Math.round(weather.current.temp_c).toString(),
            feelsLike: Math.round(weather.current.feelslike_c).toString(),
            humidity: weather.current.humidity.toString(),
            description: weather.current.condition.text,
            icon: iconUrl,
            year: new Date().getFullYear().toString(),
            unsubscribeUrl: `${process.env.APP_URL}/unsubscribe/${sub.token}`,
          };

          await this.emailService.sendWeatherForecastEmail(sub.email, context);
          this.logger.log(`Sent forecast to ${sub.email} (${sub.city})`);
        } catch (err) {
          this.logger.error(
            `Failed to send forecast to ${sub.email}: ${err.message}`,
          );
        }
      }),
    );
  }
}

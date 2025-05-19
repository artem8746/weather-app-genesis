import { Module } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';
import { EmailService } from './email.service';

@Module({
  providers: [SendGridService, EmailService],
  exports: [EmailService, SendGridService],
})
export class EmailModule {}

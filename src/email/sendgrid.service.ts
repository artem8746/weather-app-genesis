import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'node:path';
import { promises as fs } from 'fs';
import * as sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';

export interface EmailData {
  to: string;
  subject: string;
  templateName: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendTemplateEmail(data: EmailData) {
    try {
      const html = await this.compileTemplate(
        data.templateName,
        data.context || {},
      );

      await sgMail.send({
        to: data.to,
        subject: data.subject,
        from: process.env.SENDGRID_USER || '',
        html,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error.response?.body || error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private async compileTemplate(
    templateName: string,
    variables: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      'email',
      'templates',
      `${templateName}.hbs`,
    );

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);

    return compiledTemplate(variables);
  }
}

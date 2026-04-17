import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(options: SendMailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}

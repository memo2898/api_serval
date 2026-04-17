import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Enviar un correo electrónico' })
  @ApiResponse({ status: 201, description: 'Correo enviado exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error al enviar el correo.' })
  async sendMail(@Body() sendMailDto: SendMailDto) {
    await this.mailService.send(sendMailDto);
    return { success: true, message: 'Correo enviado exitosamente.' };
  }
}

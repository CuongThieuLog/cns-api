import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { EmailForgotPasswordDto, EmailRegisterDto } from 'src/auth/dto/auth.dto'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendSignUpMail({ name, email, token }: EmailRegisterDto) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to NSCinema!',
      template: './register.hbs',
      context: {
        name,
        token,
      },
    })
  }

  async sendForgotPasswordMail({ name, email, token }: EmailForgotPasswordDto) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './forgot-password.hbs',
      context: {
        name,
        token,
      },
    })
  }
}

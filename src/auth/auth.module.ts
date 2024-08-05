import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { MailModule } from 'src/mail/mail.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

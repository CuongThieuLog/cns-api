import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CinemaModule } from './cinema/cinema.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { CommentModule } from './comment/comment.module'
import { MailModule } from './mail/mail.module'
import { MailService } from './mail/mail.service'
import { MovieModule } from './movie/movie.module'
import { PaymentModule } from './payment/payment.module'
import { PersonModule } from './person/person.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { ProductModule } from './product/product.module'
import { ProfileModule } from './profile/profile.module'
import { ScheduleModule } from './schedule/schedule.module'
import { ScreenModule } from './screen/screen.module'
import { SeatModule } from './seat/seat.module'
import { StatisticalModule } from './statistical/statistical.module'
import { TicketModule } from './ticket/ticket.module'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MovieModule,
    CloudinaryModule,
    ProfileModule,
    CommentModule,
    CinemaModule,
    PersonModule,
    ProductModule,
    SeatModule,
    ScreenModule,
    ScheduleModule,
    TicketModule,
    PaymentModule,
    StatisticalModule,
  ],
  controllers: [],
  providers: [AppService, PrismaService, MailService],
})
export class AppModule {}

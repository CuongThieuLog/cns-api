import { Module } from '@nestjs/common'
import { PaymentModule } from 'src/payment/payment.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { TicketController } from './ticket.controller'
import { TicketService } from './ticket.service'

@Module({
  imports: [PrismaModule, PaymentModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

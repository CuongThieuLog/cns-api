import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [PrismaModule],
})
export class PaymentModule {}

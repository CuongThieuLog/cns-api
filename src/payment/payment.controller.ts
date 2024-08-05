import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/guard/auth.guard'
import { PaymentDto, PaymentRefundDto } from './dto/payment.dto'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('create-intent')
  createPaymentIntent(@Body() { amount }: PaymentDto) {
    return this.paymentService.createPaymentIntent({ amount })
  }

  @UseGuards(AuthGuard)
  @Post('create-refund')
  createPaymentRefund(@Body() { payment_intent_id, amount }: PaymentRefundDto) {
    return this.paymentService.createPaymentRefund({ payment_intent_id, amount })
  }
}

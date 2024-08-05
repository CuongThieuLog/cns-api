import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { PaymentDto, PaymentRefundDto } from './dto/payment.dto'

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2023-10-16',
    })
  }

  async createPaymentIntent({ amount }: PaymentDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'vnd',
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return { paymentIntent: paymentIntent.client_secret }
    } catch (error) {
      return error
    }
  }

  async createPaymentRefund({ payment_intent_id, amount }: PaymentRefundDto) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment_intent_id,
        amount,
        reason: 'requested_by_customer',
      })

      return refund.description
    } catch (error) {
      throw error
    }
  }
}

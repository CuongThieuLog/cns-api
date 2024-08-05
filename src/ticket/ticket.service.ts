import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PaymentService } from 'src/payment/payment.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private payment: PaymentService,
  ) {}

  async create({ price, schedule_id, seats, payment_intent_id, foods, user_id }: CreateTicketDto) {
    try {
      const ticket = await this.prisma.ticket.create({
        data: {
          price,
          schedule_id,
          payment_status: 'SUCCESS',
          user_id,
          payment_intent_id,
          seats: {
            createMany: {
              data: seats.map((id) => ({ seat_id: id })),
            },
          },
          foods: {
            createMany: {
              data: foods.map((id) => ({ food_id: id })),
            },
          },
        },
      })

      return ticket
    } catch (error) {
      throw error
    }
  }

  async getUncheckedTicketsForUser(user_id: string) {
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: {
          user_id,
          is_checkin: false,
          payment_status: 'SUCCESS',
          schedule: {
            start_time: {
              gte: new Date(),
            },
          },
        },
        include: {
          seats: {
            select: {
              id: true,
              seat: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          schedule: {
            select: {
              start_time: true,
              end_time: true,
              screen: {
                select: {
                  name: true,
                  cinema: {
                    select: {
                      name: true,
                      address: true,
                    },
                  },
                },
              },
              movie: {
                select: {
                  name: true,
                  movie_image: true,
                },
              },
            },
          },
        },
      })

      const flatData = tickets.map((ticket) => {
        const { seats, schedule, ...rest } = ticket
        return {
          ...rest,
          tickets: seats.map((seat) => {
            return { ticket_id: seat.id, seat_name: seat.seat.name }
          }),
          schedule: {
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            screen_name: schedule.screen.name,
            cinema_name: schedule.screen.cinema.name,
            cinema_address: schedule.screen.cinema.address,
            movie_name: schedule.movie.name,
            movie_image: schedule.movie.movie_image.map((image) => image.path)[0],
          },
        }
      })

      return flatData
    } catch (error) {
      throw error
    }
  }

  async detail({ id, user_id }: { id: string; user_id: string }) {
    try {
      const ticket = await this.prisma.ticket.findFirst({
        where: {
          user_id,
          id,
          schedule: {
            start_time: {
              gte: new Date(),
            },
          },
        },
        include: {
          seats: {
            select: {
              id: true,
              seat: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          schedule: {
            select: {
              start_time: true,
              end_time: true,
              screen: {
                select: {
                  name: true,
                  cinema: {
                    select: {
                      name: true,
                      address: true,
                      image: true,
                    },
                  },
                },
              },
              movie: {
                select: {
                  name: true,
                  movie_image: true,
                  language_movie: true,
                  movie_format: {
                    select: {
                      name: true,
                    },
                  },
                  movie_type: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      const { seats, schedule, ...rest } = ticket

      const flatData = {
        ...rest,
        tickets: seats.map((seat) => {
          return { ticket_id: seat.id, seat_name: seat.seat.name }
        }),
        schedule: {
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          screen_name: schedule.screen.name,
          cinema_name: schedule.screen.cinema.name,
          cinema_address: schedule.screen.cinema.address,
          movie_name: schedule.movie.name,
          movie_image: schedule.movie.movie_image.map((image) => image.path)[0],
          cinema_image: schedule.screen.cinema.image,
          movie_type: schedule.movie.movie_type.name,
          movie_format: schedule.movie.movie_format.name,
          movie_language: schedule.movie.language_movie,
        },
      }

      return flatData
    } catch (error) {
      return error
    }
  }

  async ticketCancellation({ id, user_id }: { id: string; user_id: string }) {
    try {
      const ticket = await this.prisma.ticket.findFirst({
        where: {
          user_id,
          id,
          schedule: {
            start_time: {
              gte: new Date(),
            },
          },
        },
        include: {
          schedule: true,
        },
      })

      if (!ticket) throw new NotFoundException('Vé không tồn tại')
      if (ticket.payment_status === 'REFUNDED')
        throw new BadRequestException('Vé đã được hoàn tiền')

      // Cannot cancel ticket after the show has started 24 hours
      const startTime = new Date(ticket.schedule.start_time)
      const now = new Date()
      const diff = startTime.getTime() - now.getTime()
      const diffInHours = diff / (1000 * 3600)

      if (diffInHours < 24)
        throw new BadRequestException('Bạn không thể hủy vé sau 24h trước giờ chiếu')

      await this.payment.createPaymentRefund({
        amount: ticket.price,
        payment_intent_id: ticket.payment_intent_id,
      })

      const result = await this.prisma.ticket.update({
        where: {
          id,
        },
        data: {
          payment_status: 'REFUNDED',
          canceled_at: new Date(),
        },
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async checkInTicket({ id, user_id }: { id: string; user_id: string }) {
    try {
      const ticket = await this.prisma.ticket.findFirst({
        where: {
          user_id,
          id,
          schedule: {
            start_time: {
              gte: new Date(),
            },
          },
        },
      })

      if (!ticket) throw new NotFoundException('Ticket not found or expired').getResponse()

      const result = await this.prisma.ticket.update({
        where: {
          id,
        },
        data: {
          is_checkin: true,
        },
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async history(user_id: string) {
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: {
          user_id,
        },
        include: {
          seats: {
            select: {
              id: true,
              seat: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          schedule: {
            select: {
              start_time: true,
              end_time: true,
              screen: {
                select: {
                  name: true,
                  cinema: {
                    select: {
                      name: true,
                      address: true,
                      image: true,
                    },
                  },
                },
              },
              movie: {
                select: {
                  name: true,
                  movie_image: true,
                  language_movie: true,
                  movie_type: {
                    select: {
                      name: true,
                    },
                  },
                  movie_format: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      const flatData = tickets.map((ticket) => {
        const { seats, schedule, ...rest } = ticket
        return {
          ...rest,
          tickets: seats.map((seat) => {
            return { ticket_id: seat.id, seat_name: seat.seat.name }
          }),
          schedule: {
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            screen_name: schedule.screen.name,
            cinema_name: schedule.screen.cinema.name,
            cinema_address: schedule.screen.cinema.address,
            movie_name: schedule.movie.name,
            movie_image: schedule.movie.movie_image.map((image) => image.path)[0],
            cinema_image: schedule.screen.cinema.image,
            movie_type: schedule.movie.movie_type.name,
            movie_format: schedule.movie.movie_format.name,
            movie_language: schedule.movie.language_movie,
          },
        }
      })

      return flatData
    } catch (error) {
      throw error
    }
  }
}

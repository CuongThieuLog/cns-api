import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSeatDto } from './dto/create-seat.dto'

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async seedSeatForRoom({
    row,
    column,
    screen_id,
  }: {
    row: number
    column: string[]
    screen_id: string
  }) {
    console.log('RUN SEED')
    const seats: CreateSeatDto[] = []

    for (let i = 0; i < column.length; i++) {
      for (let j = 1; j <= row; j++) {
        seats.push({
          row: column[i],
          column: j,
          screen_id,
          seat_type: 'NORMAL',
          name: j < 10 ? `${column[i]}0${j}` : `${column[i]}${j}`,
        })
      }
    }

    try {
      const seat = await this.prisma.seat.createMany({
        data: seats,
      })

      return seat
    } catch (error) {
      console.error('SEED ERROR')
      throw error
    }
  }

  async create({ row, column, screen_id, seat_type }: CreateSeatDto) {
    try {
      const checkSeat = await this.prisma.seat.findFirst({
        where: {
          row,
          column,
          screen_id,
        },
      })

      if (checkSeat) {
        throw new Error('Seat already exists')
      }

      const seat = await this.prisma.seat.create({
        data: {
          row,
          column,
          screen_id,
          seat_type,
          name: `${column}${row}`,
        },
      })

      console.log(seat)
    } catch (error) {
      throw error
    }
  }

  async update(id: string, { row, column, screen_id, seat_type }: CreateSeatDto) {
    try {
      const seat = await this.prisma.seat.update({
        where: {
          id,
        },
        data: {
          row,
          column,
          screen_id,
          seat_type,
        },
      })

      return seat
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const seat = await this.prisma.seat.delete({
        where: {
          id,
        },
      })

      return seat
    } catch (error) {
      throw error
    }
  }

  async getSeatBySchedule(movie_schedule_id: string) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: {
          id: movie_schedule_id,
        },
        include: {
          movie: {
            include: {
              movie_image: true,
            },
          },
        },
      })

      if (!schedule) {
        throw new BadRequestException('Movie schedule not found')
      }

      const screen = await this.prisma.screen.findFirst({
        where: {
          id: schedule.screen_id,
        },
        include: {
          cinema: true,
          seats: true,
          schedule: {
            where: {
              id: movie_schedule_id,
            },
            include: {
              ticket: {
                include: {
                  seats: true,
                },
                where: {
                  payment_status: 'SUCCESS',
                },
              },
            },
          },
        },
      })

      const bookedSeatIds = screen.schedule.flatMap(
        (item) => item.ticket?.map((ticket) => ticket.seats) || [],
      )
      const flatBookedSeatIds = bookedSeatIds.flat()
      const seats = screen.seats.map((seat) => ({
        ...seat,
        is_booked: flatBookedSeatIds.some((seatObj) => seatObj.seat_id === seat.id),
      }))

      const rows = [...new Set(seats.map((seat) => seat.row))]
      const seatsByRow = rows.map((row) => seats.filter((seat) => seat.row === row))

      return { ...screen, schedule, seats: seatsByRow }
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const seats = await this.prisma.seat.findMany({
        include: {
          screen: true,
        },
      })

      return seats
    } catch (error) {
      throw error
    }
  }
}

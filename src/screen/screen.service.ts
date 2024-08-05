import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SeatService } from 'src/seat/seat.service'
import { CreateScreenDto } from './dto/create-screen.dto'

@Injectable()
export class ScreenService {
  constructor(
    private prisma: PrismaService,
    private seat: SeatService,
  ) {}

  async create({ cinema_id, column_size, name, row_size }: CreateScreenDto) {
    try {
      const cinema = await this.prisma.cinema.findUnique({
        where: { id: cinema_id },
      })

      if (!cinema) {
        throw new BadRequestException('Cinema not found')
      }

      const screen = await this.prisma.screen.create({
        data: {
          cinema_id,
          column_size,
          name,
          row_size,
        },
        include: { seats: true },
      })

      const column = this.rowSizeToString(row_size)

      if (screen) {
        await this.seat.seedSeatForRoom({
          column: column,
          row: row_size,
          screen_id: screen.id,
        })

        return screen
      }

      return { message: 'Screen created successfully' }
    } catch (error) {
      throw error
    }
  }

  async update(id: string, { column_size, name, row_size }: CreateScreenDto) {
    try {
      const screen = await this.prisma.screen.findFirst({
        where: { id },
        include: { seats: true },
      })

      if (!screen) {
        throw new BadRequestException('Screen not found')
      }

      // column is string array as ['A', 'B', 'C', ...]
      // row is number
      if (screen.column_size > column_size || screen.row_size > row_size) {
        for (let i = 0; i < screen.column_size; i++) {
          for (let j = 1; j <= screen.row_size; j++) {
            // Convert the column index to a letter
            const row = String.fromCharCode(65 + i)

            const seat = await this.prisma.seat.findFirst({
              where: {
                screen_id: screen.id,
                column: j,
                row: row,
              },
            })

            if (seat) {
              await this.prisma.seat.delete({
                where: { id: seat.id },
              })
            }
          }
        }
      }

      const screenUpdate = await this.prisma.screen.update({
        where: { id },
        data: {
          column_size,
          name,
          row_size,
        },
      })

      return screenUpdate
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const screens = await this.prisma.screen.findMany({
        include: { seats: true, cinema: true },
      })

      return screens
    } catch (error) {
      throw error
    }
  }

  async byId(id: string) {
    try {
      const screen = await this.prisma.screen.findUnique({
        where: { id },
        include: { seats: true, cinema: true },
      })

      if (!screen) throw new NotFoundException('Screen not found')

      return screen
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const screen = await this.prisma.screen.delete({
        where: { id },
      })

      return screen
    } catch (error) {
      throw error
    }
  }

  private rowSizeToString(row_size: number): string[] {
    const row: string[] = []

    for (let i = 0; i < row_size; i++) {
      // Convert the index to an ASCII code of a capital letter
      // (65 is the ASCII code for 'A')
      let charCode = 65 + i

      // If the index is greater than 25 ('Z'), loop back to 'A'
      if (i >= 26) {
        charCode = 65 + (i % 26)
      }

      // Convert the ASCII code to a character and append it to the result
      row.push(String.fromCharCode(charCode))
    }

    return row
  }
}

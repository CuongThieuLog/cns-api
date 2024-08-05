import { BadRequestException, Delete, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateScheduleDto } from './dto/create-schedule.dto'

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateScheduleDto) {
    const { screen_id, movie_id, ...scheduleData } = data

    try {
      const screenExists = await this.prisma.screen.findUnique({ where: { id: screen_id } })
      const movieExists = await this.prisma.movie.findUnique({ where: { id: movie_id } })

      if (!screenExists) {
        throw new BadRequestException('Screen does not exist')
      }

      if (!movieExists) {
        throw new BadRequestException("Movie doesn't exist")
      }

      const schedule = await this.prisma.schedule.create({
        data: {
          ...scheduleData,
          screen: {
            connect: {
              id: data.screen_id,
            },
          },
          movie: {
            connect: {
              id: data.movie_id,
            },
          },
        },
      })

      return schedule
    } catch (error) {
      throw error
    }
  }

  async update(id: string, data: CreateScheduleDto) {
    const { screen_id, movie_id, ...scheduleData } = data

    try {
      const screenExists = await this.prisma.screen.findUnique({ where: { id: screen_id } })
      const movieExists = await this.prisma.movie.findUnique({ where: { id: movie_id } })

      if (!screenExists) {
        throw new BadRequestException(`Screen with ID ${screen_id} not found`)
      }

      if (!movieExists) {
        throw new BadRequestException(`Movie with ID ${movie_id} not found`)
      }

      if (scheduleData.start_time >= new Date())
        return new BadRequestException('Schedule has passed')

      const schedule = await this.prisma.schedule.update({
        where: { id },
        data: {
          ...scheduleData,
          screen: {
            connect: {
              id: data.screen_id,
            },
          },
          movie: {
            connect: {
              id: data.movie_id,
            },
          },
        },
      })

      return schedule
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const schedules = await this.prisma.schedule.findMany({
        include: {
          screen: {
            include: {
              cinema: true,
            },
          },
          movie: true,
        },
      })

      return schedules
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  async delete(id: string) {
    try {
      const schedule = await this.prisma.schedule.findUnique({ where: { id } })

      if (!schedule) {
        throw new BadRequestException('Schedule not found')
      }

      if (schedule.start_time < new Date()) throw new BadRequestException('Schedule has passed')
      await this.prisma.schedule.delete({ where: { id } })

      return {
        message: 'Delete schedule successfully',
      }
    } catch (error) {
      throw error
    }
  }

  private toHoursAndMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return { hours, minutes }
  }
}

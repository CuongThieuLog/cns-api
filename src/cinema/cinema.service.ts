import { Injectable, NotFoundException } from '@nestjs/common'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCinemaDto, GetCinemaByIdDto, GetMovieByCinemaDto } from './dto/create-cinema.dto'

@Injectable()
export class CinemaService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create({ address, name, phone_number }: CreateCinemaDto, file: Express.Multer.File) {
    try {
      const imageUpload = await this.cloudinary.uploadFile(file, 'ns-cinema/cinema')

      const cinema = await this.prisma.cinema.create({
        data: {
          address,
          image: imageUpload.url,
          name,
          phone_number,
        },
      })

      return cinema
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const cinemas = await this.prisma.cinema.findMany()

      return cinemas
    } catch (error) {
      throw error
    }
  }

  async byId({ id }: GetCinemaByIdDto) {
    try {
      const cinema = await this.prisma.cinema.findUnique({
        where: {
          id,
        },
      })

      if (!cinema) {
        throw new NotFoundException('Cinema not found')
      }

      return cinema
    } catch (error) {
      throw error
    }
  }

  async update(
    id: string,
    { address, name, phone_number }: CreateCinemaDto,
    file: Express.Multer.File,
  ) {
    try {
      const checkCinema = await this.prisma.cinema.findUnique({
        where: {
          id,
        },
      })

      if (!checkCinema) {
        throw new NotFoundException('Cinema not found')
      }

      if (file) await this.deleteImageCloudinary(checkCinema.image)

      const image = file
        ? (await this.cloudinary.uploadFile(file, 'ns-cinema/cinema')).url
        : checkCinema.image

      const cinema = await this.prisma.cinema.update({
        where: {
          id,
        },
        data: {
          address,
          image,
          name,
          phone_number,
        },
      })

      return cinema
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const cinema = await this.prisma.cinema.findUnique({
        where: {
          id,
        },
        include: {
          screen: true,
        },
      })

      if (!cinema) {
        throw new NotFoundException('Cinema not found')
      }

      if (cinema.screen.length > 0) {
        throw new NotFoundException('Cinema has screen, dont delete')
      }

      await this.deleteImageCloudinary(cinema.image)

      await this.prisma.cinema.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Delete cinema successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async listCinemaMovieByTime({ id, start_time }: GetMovieByCinemaDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        movie_type: true,
        movie_format: true,
      },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found')
    }

    const start = this.convertDayToStart(new Date(start_time))
    const end = this.convertDayToStart(new Date(start_time), 1)

    const cinemas = await this.prisma.cinema.findMany({
      include: {
        screen: {
          include: {
            schedule: {
              include: { screen: true },
              where: {
                movie_id: id,
                start_time: { gte: start, lte: end },
              },
            },
          },
        },
      },
    })

    const cinemasWithSchedules = cinemas
      .map((cinema) => {
        const schedules = cinema.screen.flatMap((screen) => screen.schedule)
        if (schedules.length === 0) return null

        return {
          ...cinema,
          screen: undefined,
          schedule: schedules,
        }
      })
      .filter(Boolean)

    return { cinema: cinemasWithSchedules, movie }
  }

  private convertDayToStart(time: Date | undefined, dayOffset: number = 0) {
    if (!time) return

    const year = time.getFullYear()
    const month = time.getMonth()
    const date = time.getDate() + dayOffset

    return new Date(year, month, date, 0, 0, 0)
  }

  private deleteImageCloudinary = async (url: string) => {
    const public_id = `ns-cinema/cinema/${url.split('/').pop().split('.')[0]}`

    await this.cloudinary.bulkDelete([public_id])
  }
}

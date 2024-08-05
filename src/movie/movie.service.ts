import { BadRequestException, Injectable } from '@nestjs/common'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateMovieDto } from './dto/create-movie.dto'

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    data: CreateMovieDto,
    files: { images: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    const { person_id, ...movieData } = data

    try {
      const checkPerson = await this.prisma.person.findMany({
        where: {
          id: {
            in: person_id,
          },
        },
      })

      const checkMovieType = await this.prisma.movieType.findUnique({
        where: {
          id: movieData.movie_type_id,
        },
      })

      const checkMovieFormat = await this.prisma.movieFormat.findUnique({
        where: {
          id: movieData.movie_format_id,
        },
      })

      if (!checkMovieType) {
        throw new BadRequestException('Movie type not found')
      }

      if (!checkMovieFormat) {
        throw new BadRequestException('Movie format not found')
      }

      if (checkPerson.length !== person_id.length) {
        throw new BadRequestException('Person not found')
      }

      const uploadImages: { path: string }[] = []

      if (files.images.length > 0) {
        const upload = await this.cloudinary.uploadImagesMovie(files.images)

        upload.map((image) => {
          uploadImages.push({
            path: image.url,
          })
        })
      }

      const video = files.video ? await this.cloudinary.uploadVideo(files.video[0]) : null

      const movie = await this.prisma.movie.create({
        data: {
          ...movieData,
          trailer_movie: video.url,
          persons: {
            createMany: {
              data: person_id.map((id) => ({ person_id: id })),
            },
          },
          movie_image: {
            createMany: {
              data: uploadImages.map((image) => ({ path: image.path })),
            },
          },
        },
        include: {
          comment: true,
          movie_format: true,
          movie_image: true,
          persons: {
            include: {
              person: true,
            },
          },
          schedule: true,
          movie_type: true,
        },
      })

      return movie
    } catch (error) {
      throw error
    }
  }

  async update(
    id: string,
    data: CreateMovieDto,
    files: { images: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    try {
      const checkPerson = await this.prisma.person.findMany({
        where: {
          id: {
            in: data.person_id,
          },
        },
      })

      const checkMovieType = await this.prisma.movieType.findUnique({
        where: {
          id: data.movie_type_id,
        },
      })

      const checkMovieFormat = await this.prisma.movieFormat.findUnique({
        where: {
          id: data.movie_format_id,
        },
      })

      if (!checkMovieType) {
        throw new BadRequestException('Movie type not found')
      }

      if (!checkMovieFormat) {
        throw new BadRequestException('Movie format not found')
      }

      if (checkPerson.length !== data.person_id.length) {
        throw new BadRequestException('Person not found')
      }

      const checkMovie = await this.prisma.movie.findUnique({
        where: {
          id,
        },
        include: {
          movie_image: true,
        },
      })

      if (!checkMovie) {
        throw new BadRequestException('Movie not found')
      }

      if (files.images && files.images.length > 0) {
        await this.deleteImagesCloudinary(checkMovie.movie_image.map((image) => image.path))
        await this.prisma.movieImage.deleteMany({
          where: {
            movie_id: id,
          },
        })
        const upload = await this.cloudinary.uploadImagesMovie(files.images)
        await this.prisma.movieImage.createMany({
          data: upload.map((image) => ({ path: image.url, movie_id: id })),
        })
      }

      if (files.video) await this.deleteVideoCloudinary(checkMovie.trailer_movie)

      const trailer_movie = files.video
        ? (await this.cloudinary.uploadVideo(files.video[0])).url
        : checkMovie.trailer_movie

      await this.prisma.movie.update({
        where: {
          id,
        },
        data: {
          trailer_movie,
          persons: {
            deleteMany: {
              movie_id: id,
            },
            createMany: {
              data: data.person_id.map((id) => ({ person_id: id })),
            },
          },
          movie_format_id: data.movie_format_id,
          movie_type_id: data.movie_type_id,
          name: data.name,
          released_date: data.released_date,
          duration: data.duration,
          brief_movie: data.brief_movie,
          is_deleted: data.is_deleted,
          language_movie: data.language_movie,
          limit_age: data.limit_age,
          national: data.national,
          ticket_price: data.ticket_price,
        },
      })

      return {
        message: 'Update successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const movie = await this.prisma.movie.update({
        where: {
          id,
        },
        data: {
          is_deleted: true,
        },
      })

      return movie
    } catch (error) {
      throw error
    }
  }

  async deleteMovie(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: {
          id,
        },
        include: {
          movie_image: true,
          schedule: true,
        },
      })

      if (!movie) {
        throw new BadRequestException('Movie not found')
      }

      if (movie.schedule.length > 0) {
        throw new BadRequestException('Movie has schedule, dont delete')
      }

      await this.deleteVideoCloudinary(movie.trailer_movie)
      await this.deleteImagesCloudinary(movie.movie_image.map((image) => image.path))

      await this.prisma.movie.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Delete movie successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async list() {
    try {
      const movies = await this.prisma.movie.findMany({
        where: {
          released_date: {
            lte: new Date(),
          },
        },
        include: {
          comment: true,
          movie_format: true,
          movie_image: true,
          persons: {
            include: {
              person: true,
            },
          },
          schedule: true,
          movie_type: true,
        },
      })

      const movieMapper = movies.map((movie) => {
        const { persons, ...rest } = movie

        return {
          ...rest,
          rate: {
            star: movie.comment.reduce((acc, curr) => acc + curr.star, 0) / movie.comment.length,
            total_rate: movie.comment.length,
          },
          persons: persons.map((person) => {
            const { person: personData } = person

            return {
              ...personData,
            }
          }),
        }
      })

      return movieMapper
    } catch (error) {
      throw error
    }
  }

  async listAdmin() {
    try {
      const movies = await this.prisma.movie.findMany({
        include: {
          comment: true,
          movie_format: true,
          movie_image: true,
          persons: {
            include: {
              person: true,
            },
          },
          schedule: true,
          movie_type: true,
        },
      })

      const movieMapper = movies.map((movie) => {
        const { persons, ...rest } = movie

        return {
          ...rest,
          rate: {
            star: movie.comment.reduce((acc, curr) => acc + curr.star, 0) / movie.comment.length,
            total_rate: movie.comment.length,
          },
          persons: persons.map((person) => {
            const { person: personData } = person

            return {
              ...personData,
            }
          }),
        }
      })

      return movieMapper
    } catch (error) {
      throw error
    }
  }

  async listComingSoon() {
    const movies = await this.prisma.movie.findMany({
      where: {
        released_date: {
          gte: new Date(),
        },
      },
      include: {
        movie_type: true,
        movie_format: true,
        movie_image: true,
        persons: true,
      },
      orderBy: {
        released_date: 'asc',
      },
    })

    const groupedMovies = movies.reduce((acc, curr) => {
      const existingGroup = acc.find((group: any[]) => {
        const groupDate = new Date(group[0].released_date)
        const currDate = new Date(curr.released_date)

        return (
          groupDate.getMonth() === currDate.getMonth() &&
          groupDate.getFullYear() === currDate.getFullYear()
        )
      })

      if (existingGroup) {
        existingGroup.push(curr)
      } else {
        acc.push([curr])
      }
      return acc
    }, [])

    return groupedMovies
  }

  async getMovieFormatById(id: string) {
    try {
      const movieFormat = await this.prisma.movieFormat.findUnique({
        where: {
          id,
        },
      })

      return movieFormat
    } catch (error) {
      throw error
    }
  }

  async getMovieTypeById(id: string) {
    try {
      const movieType = await this.prisma.movieType.findUnique({
        where: {
          id,
        },
      })

      return movieType
    } catch (error) {
      throw error
    }
  }

  async byId(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: {
          id,
        },
        include: {
          comment: {
            select: {
              id: true,
              content: true,
              star: true,
              created_at: true,
              image: true,
              feeling: true,
              user: {
                select: {
                  id: true,
                  avatar: true,
                  first_name: true,
                  last_name: true,
                  email_verified: true,
                },
              },
            },
          },
          movie_format: true,
          movie_image: true,
          persons: {
            include: {
              person: true,
            },
          },
          schedule: true,
          movie_type: true,
        },
      })

      const movieMapper = {
        ...movie,
        rate: {
          star: movie.comment.reduce((acc, curr) => acc + curr.star, 0) / movie.comment.length,
          total_rate: movie.comment.length,
        },
        persons: movie.persons.map((person) => {
          const { person: personData } = person

          return {
            ...personData,
          }
        }),
      }

      return movieMapper
    } catch (error) {
      throw error
    }
  }

  async getMovieByType(id: string) {
    try {
      const movie = await this.prisma.movie.findMany({
        where: {
          movie_type_id: id,
        },
        include: {
          movie_format: true,
          movie_image: true,
          persons: true,
          schedule: true,
          movie_type: true,
        },
      })

      return movie
    } catch (error) {
      throw error
    }
  }

  async createMovieFormat({ name }: { name: string }) {
    try {
      const movieFormat = await this.prisma.movieFormat.create({
        data: {
          name,
        },
      })

      return movieFormat
    } catch (error) {
      throw error
    }
  }

  async getAllMovieFormat() {
    try {
      const movieFormat = await this.prisma.movieFormat.findMany()

      return movieFormat
    } catch (error) {
      throw error
    }
  }

  async updateMovieFormat(id: string, { name }: { name: string }) {
    try {
      const movieFormat = await this.prisma.movieFormat.update({
        where: {
          id,
        },
        data: {
          name,
        },
      })

      return movieFormat
    } catch (error) {
      throw error
    }
  }

  async deleteMovieFormat(id: string) {
    try {
      const movieFormat = await this.prisma.movieFormat.findUnique({
        where: {
          id,
        },
        include: {
          movie: true,
        },
      })

      if (!movieFormat) {
        throw new BadRequestException('Movie format not found')
      }

      if (movieFormat.movie.length > 0)
        throw new BadRequestException('Movie format has dont delete')

      await this.prisma.movieFormat.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Delete movie format successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async createMovieType({ name }: { name: string }) {
    try {
      const movieType = await this.prisma.movieType.create({
        data: {
          name,
        },
      })

      return movieType
    } catch (error) {
      throw error
    }
  }

  async getAllMovieType() {
    try {
      const movieType = await this.prisma.movieType.findMany()

      return movieType
    } catch (error) {
      throw error
    }
  }

  async updateMovieType(id: string, { name }: { name: string }) {
    try {
      const checkMovieType = await this.prisma.movieType.findUnique({
        where: {
          id,
        },
      })

      if (!checkMovieType) {
        throw new BadRequestException('Movie type not found')
      }

      const movieType = await this.prisma.movieType.update({
        where: {
          id,
        },
        data: {
          name,
        },
      })

      return movieType
    } catch (error) {
      throw error
    }
  }

  async deleteMovieType(id: string) {
    try {
      const movieType = await this.prisma.movieType.findUnique({
        where: {
          id,
        },
        include: {
          movie: true,
        },
      })

      if (!movieType) {
        throw new BadRequestException('Movie type not found')
      }

      if (movieType.movie.length > 0) throw new BadRequestException('Movie type has dont delete')

      await this.prisma.movieType.delete({
        where: {
          id,
        },
      })

      return {
        message: 'Delete movie type successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async byUserId(user_id: string) {
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: {
          user_id,
          is_checkin: true,
        },
        include: {
          schedule: {
            include: {
              movie: true,
            },
          },
        },
      })

      const movieIds = new Set(tickets.map((ticket) => ticket.schedule.movie.id))
      const uniqueMovies = Array.from(movieIds).map(
        (id) => tickets.find((ticket) => ticket.schedule.movie.id === id)?.schedule.movie,
      )

      return uniqueMovies
    } catch (error) {
      throw error
    }
  }

  private deleteVideoCloudinary = async (url: string) => {
    const public_id = `ns-cinema/video/${url.split('/').pop().split('.')[0]}`

    await this.cloudinary.bulkDelete([public_id])
  }

  private deleteImageCloudinary = async (url: string) => {
    const public_id = `ns-cinema/movie/${url.split('/').pop().split('.')[0]}`

    await this.cloudinary.bulkDelete([public_id])
  }

  private deleteImagesCloudinary = async (urls: string[]) => {
    const base_public_id = 'ns-cinema/movie/'
    const public_ids = urls.map((url) => {
      const public_id = url.split('/').pop().split('.')[0]
      return `${base_public_id}${public_id}`
    })

    await this.cloudinary.bulkDelete(public_ids)
  }
}

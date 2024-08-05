import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StatisticalService {
  constructor(private prisma: PrismaService) {}

  async topRevenueInMonth() {
    try {
      const data = await this.prisma.ticket.groupBy({
        by: ['schedule_id'],
        _sum: {
          price: true,
        },
        where: {
          schedule: {
            start_time: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            },
          },
        },
      })

      return {
        month: new Date().getMonth() + 1,
        revenue: data.reduce((acc, cur) => acc + cur._sum.price, 0),
      }
    } catch (error) {
      throw error
    }
  }

  async getRevenueIn12Months() {
    try {
      const data = await this.prisma.ticket.findMany({
        where: {
          schedule: {
            start_time: {
              gte: new Date(new Date().getFullYear(), 0, 1),
              lte: new Date(new Date().getFullYear(), 11, 31),
            },
          },
        },
        select: {
          price: true,
          schedule: {
            select: {
              start_time: true,
            },
          },
        },
      })

      //render data 12 months before now
      const result = []
      for (let i = 0; i < 12; i++) {
        result.push({
          month: i + 1,
          revenue: 0,
        })
      }

      data.forEach((ticket) => {
        const month = ticket.schedule.start_time.getMonth()
        result[month].revenue += ticket.price
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async getTransactionMovieIn12Months() {
    try {
      const data = await this.prisma.ticket.findMany({
        where: {
          schedule: {
            start_time: {
              gte: new Date(new Date().getFullYear(), 0, 1),
              lte: new Date(new Date().getFullYear(), 11, 31),
            },
          },
        },
        select: {
          schedule: {
            select: {
              start_time: true,
            },
          },
        },
      })

      //render data 12 months before now
      const result = []
      for (let i = 0; i < 12; i++) {
        result.push({
          month: i + 1,
          transaction: 0,
        })
      }

      data.forEach((ticket) => {
        const month = ticket.schedule.start_time.getMonth()
        result[month].transaction += 1
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async getRevenueMovieIn12Months() {
    try {
      const now = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)

      const ticketMovie = await this.prisma.ticket.findMany({
        where: {
          schedule: {
            start_time: {
              gte: oneYearAgo,
              lte: now,
            },
          },
        },
        include: {
          schedule: {
            include: {
              movie: true,
            },
          },
        },
      })

      const data = ticketMovie.map((ticket) => ({
        movie: ticket.schedule.movie,
        revenue: ticket.price,
      }))

      const groupedData = data.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.movie.id === cur.movie.id)
        if (index === -1) {
          acc.push(cur)
        } else {
          acc[index].revenue += cur.revenue
        }

        return acc
      }, [])

      return groupedData
    } catch (error) {
      throw error
    }
  }

  async getTransactionInWeek() {
    try {
      const data = await this.prisma.ticket.findMany({
        where: {
          payment_status: 'SUCCESS',
          schedule: {
            start_time: {
              gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - 7,
              ),
              lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            },
          },
        },
        select: {
          price: true,
          schedule: {
            select: {
              start_time: true,
            },
          },
        },
      })

      const result = []
      for (let i = 0; i < 7; i++) {
        result.push({
          day: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - i),
          transaction: 0,
          total: 0,
        })
      }

      data.forEach((ticket) => {
        const day = ticket.schedule.start_time.getDate()
        result[day].total += ticket.price
        result[day].transaction += 1
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async renderRevenueByStartTimeAndEndTime(startTime: Date, endTime: Date) {
    try {
      const data = await this.prisma.ticket.findMany({
        where: {
          schedule: {
            created_at: {
              gte: startTime,
              lte: endTime,
            },
          },
        },
        select: {
          price: true,
          schedule: {
            select: {
              created_at: true,
            },
          },
        },
      })

      console.log(data)

      const diffInDays = Math.ceil(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24),
      )
      const result = Array.from({ length: diffInDays }, (_, i) => ({
        day: new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + i),
        transaction: 0,
        total: 0,
      }))

      data.forEach((ticket) => {
        const dayIndex = Math.floor(
          (ticket.schedule.created_at.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24),
        )
        if (result[dayIndex]) {
          result[dayIndex].total += ticket.price
          result[dayIndex].transaction += 1
        }
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async topRevenue() {
    try {
      const data = await this.prisma.ticket.groupBy({
        by: ['schedule_id'],
        _sum: {
          price: true,
        },
        where: {
          schedule: {
            start_time: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            },
          },
        },
      })

      const result = data.sort((a, b) => b._sum.price - a._sum.price).slice(0, 5)

      return result
    } catch (error) {
      throw error
    }
  }

  async top5MovieRevenueInMonth() {
    try {
      const now = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)

      const ticketMovie = await this.prisma.ticket.findMany({
        where: {
          schedule: {
            start_time: {
              gte: oneYearAgo,
              lte: now,
            },
          },
        },
        include: {
          schedule: {
            include: {
              movie: true,
            },
          },
        },
      })

      const data = ticketMovie.map((ticket) => ({
        movie: ticket.schedule.movie,
        revenue: ticket.price,
      }))

      const groupedData = data.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.movie.id === cur.movie.id)
        if (index === -1) {
          acc.push(cur)
        } else {
          acc[index].revenue += cur.revenue
        }

        return acc
      }, [])

      const result = groupedData.sort((a, b) => b.revenue - a.revenue).slice(0, 5)

      return result
    } catch (error) {
      throw error
    }
  }

  async groupByMovie() {
    try {
      const data = await this.prisma.ticket.groupBy({
        by: ['schedule_id'],
        _sum: {
          price: true,
        },
        where: {
          schedule: {
            start_time: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            },
          },
        },
      })

      // find by schedule_id
      const scheduleIds = data.map((item) => item.schedule_id)
      const tickets = await this.prisma.ticket.findMany({
        where: {
          schedule_id: {
            in: scheduleIds,
          },
        },
        include: {
          schedule: {
            include: {
              movie: true,
            },
          },
        },
      })

      // group by movie
      const result = tickets.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.movie.id === cur.schedule.movie.id)
        if (index === -1) {
          acc.push({
            movie: cur.schedule.movie,
            revenue: cur.price,
          })
        } else {
          acc[index].revenue += cur.price
        }

        return acc
      }, [])

      return result.sort((a, b) => b.revenue - a.revenue)
    } catch (error) {
      throw error
    }
  }

  async getMovieType() {
    try {
      const data = await this.prisma.ticket.findMany({
        where: {
          payment_status: 'SUCCESS',
        },
        include: {
          schedule: {
            include: {
              movie: {
                include: {
                  movie_type: true,
                },
              },
            },
          },
        },
      })

      const countMovieTypeSameId = data.reduce((acc, cur) => {
        const index = acc.findIndex(
          (item) => item.movie_type.id === cur.schedule.movie.movie_type.id,
        )
        if (index === -1) {
          acc.push({
            movie_type: cur.schedule.movie.movie_type,
            total: 1,
          })
        } else {
          acc[index].total += 1
        }

        return acc
      }, [])

      return countMovieTypeSameId.sort((a, b) => b.count - a.count)
    } catch (error) {
      throw error
    }
  }

  async getTotal() {
    try {
      const movie = await this.prisma.movie.count()
      const ticket = await this.prisma.ticket.count()
      const user = await this.prisma.user.count()
      const totalRevenue = await this.prisma.ticket.aggregate({
        _sum: {
          price: true,
        },
      })

      return {
        movie: `${movie} phim`,
        ticket: `${ticket} vé`,
        user: `${user} người dùng`,
        totalRevenue: this.formatNumberVND(totalRevenue._sum.price),
      }
    } catch (error) {
      throw error
    }
  }

  private formatNumberVND(input: number) {
    return `${input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ`
  }
}

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const { content, user_id, movie_id, star, feeling, image } = createCommentDto
      // const checkComment = await this.checkAlreadyCommented(user_id, movie_id)

      // if (checkComment) {
      //   throw new BadRequestException("You've already commented on this movie")
      // }

      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      })

      const movie = await this.prisma.movie.findUnique({
        where: {
          id: movie_id,
        },
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      if (!movie) {
        throw new NotFoundException('Movie not found')
      }

      const comment = await this.prisma.comment.create({
        data: {
          content,
          star,
          feeling: {
            set: feeling,
          },
          image: {
            set: image,
          },
          user: {
            connect: {
              id: user_id,
            },
          },
          movie: {
            connect: {
              id: movie_id,
            },
          },
        },
      })

      return comment
    } catch (error) {
      throw error
    }
  }

  async checkAlreadyCommented(user_id: string, movie_id: string) {
    try {
      const checkComment = await this.prisma.comment.findFirst({
        where: {
          user_id,
          movie_id,
        },
      })

      return checkComment
    } catch (error) {
      throw error
    }
  }

  async deleteComment(user_id: string, id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id,
          user_id,
        },
      })

      if (!comment) {
        throw new NotFoundException('Comment not found')
      }

      const deleteComment = await this.prisma.comment.delete({
        where: {
          id,
        },
      })

      return deleteComment
    } catch (error) {
      throw error
    }
  }
}

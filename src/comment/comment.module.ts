import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CommentController } from './comment.controller'
import { CommentGateway } from './comment.gateway'
import { CommentService } from './comment.service'

@Module({
  providers: [CommentGateway, CommentService],
  imports: [PrismaModule],
  controllers: [CommentController],
})
export class CommentModule {}

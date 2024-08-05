import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/guard/auth.guard'
import { CommentService } from './comment.service'
import { CreateCommentDto, DeleteCommentDto, getByIdDto } from './dto/create-comment.dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateCommentDto) {
    return this.commentService.create(data)
  }

  @Post('/check')
  @UseGuards(AuthGuard)
  checkAlreadyCommented(@Body() { movie_id }: getByIdDto, @Req() req) {
    return this.commentService.checkAlreadyCommented(req.user.id, movie_id)
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  delete(@Param() { id }: DeleteCommentDto, @Req() req) {
    return this.commentService.deleteComment(req.user.id, id)
  }
}

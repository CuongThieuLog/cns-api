import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/guard/auth.guard'
import { CreateTicketDto, getByIdDto } from './dto/create-ticket.dto'
import { TicketService } from './ticket.service'

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateTicketDto) {
    return this.ticketService.create({ ...data })
  }

  @UseGuards(AuthGuard)
  @Get('/un-check')
  getUncheckedTicketsForUser(@Req() req) {
    return this.ticketService.getUncheckedTicketsForUser(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('history')
  getHistory(@Req() req) {
    return this.ticketService.history(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getTicketById(@Param() { id }: getByIdDto, @Req() req) {
    return this.ticketService.detail({ id, user_id: req.user.id })
  }

  @UseGuards(AuthGuard)
  @Delete('/cancellation/:id')
  cancellation(@Param() { id }: getByIdDto, @Req() req) {
    return this.ticketService.ticketCancellation({ id, user_id: req.user.id })
  }
}

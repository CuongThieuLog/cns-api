import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateSeatDto } from './dto/create-seat.dto'
import { SeatService } from './seat.service'

@ApiTags('seat')
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('/seed')
  seedSeatForRoom(
    @Body()
    { column, screen_id, row }: { row: number; screen_id: string; column: string[] },
  ) {
    return this.seatService.seedSeatForRoom({
      row,
      column,
      screen_id,
    })
  }

  @Post()
  create(@Body() data: CreateSeatDto) {
    return this.seatService.create({ ...data })
  }

  @Put(':id')
  update(@Body() data: CreateSeatDto, @Param('id') id: string) {
    return this.seatService.update(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.seatService.delete(id)
  }

  @Get('by-schedule/:schedule_id')
  getSeatBySchedule(@Param('schedule_id') schedule_id: string) {
    return this.seatService.getSeatBySchedule(schedule_id)
  }
}

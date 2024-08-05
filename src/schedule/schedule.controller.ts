import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/guard/admin.guard'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { ScheduleService } from './schedule.service'
@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  list() {
    return this.scheduleService.list()
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() data: CreateScheduleDto) {
    return this.scheduleService.create(data)
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  update(@Body() data: CreateScheduleDto, @Param('id') id: string) {
    return this.scheduleService.update(id, data)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.scheduleService.delete(id)
  }
}

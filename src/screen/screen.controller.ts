import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/guard/admin.guard'
import { CreateScreenDto } from './dto/create-screen.dto'
import { ScreenService } from './screen.service'

@ApiTags('screen')
@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @Get()
  getAll() {
    return this.screenService.list()
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.screenService.byId(id)
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() data: CreateScreenDto) {
    return this.screenService.create(data)
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  update(@Body() data: CreateScreenDto, @Param('id') id: string) {
    return this.screenService.update(id, data)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.screenService.delete(id)
  }
}

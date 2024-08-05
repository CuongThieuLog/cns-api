import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/guard/admin.guard'
import { CinemaService } from './cinema.service'
import { CreateCinemaDto, GetCinemaByIdDto, GetMovieByCinemaDto } from './dto/create-cinema.dto'

@ApiTags('cinema')
@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get()
  getAll() {
    return this.cinemaService.list()
  }

  @Get(':id')
  getById(@Param() { id }: GetCinemaByIdDto) {
    return this.cinemaService.byId({ id })
  }
  @Get('by-time/:id/:start_time')
  getCinemaMovie(@Param() param: GetMovieByCinemaDto) {
    return this.cinemaService.listCinemaMovieByTime({
      id: param.id,
      start_time: param.start_time,
    })
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createCinemaDto: CreateCinemaDto, @UploadedFile() file: Express.Multer.File) {
    return this.cinemaService.create(createCinemaDto, file)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() createCinemaDto: CreateCinemaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cinemaService.update(id, createCinemaDto, file)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cinemaService.delete(id)
  }
}

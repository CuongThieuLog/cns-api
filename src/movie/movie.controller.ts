import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/guard/admin.guard'
import { CreateMovieDto } from './dto/create-movie.dto'
import { MovieService } from './movie.service'

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getAll() {
    return this.movieService.list()
  }

  @Get('/all')
  List() {
    return this.movieService.listAdmin()
  }

  @Get('type')
  getAllMovieType() {
    return this.movieService.getAllMovieType()
  }

  @Get('format')
  getAllMovieFormat() {
    return this.movieService.getAllMovieFormat()
  }

  @Get('format/:id')
  getMovieFormatById(@Param('id') id: string) {
    return this.movieService.getMovieFormatById(id)
  }

  @Get('type/:id')
  getMovieTypeById(@Param('id') id: string) {
    return this.movieService.getMovieTypeById(id)
  }

  @Get('/coming-soon')
  getComing() {
    return this.movieService.listComingSoon()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.movieService.byId(id)
  }

  @Get('user/:id')
  getByUserId(@Param('id') id: string) {
    return this.movieService.byUserId(id)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteById(@Param('id') id: string) {
    return this.movieService.delete(id)
  }

  @Delete(':id/delete')
  @UseGuards(AdminGuard)
  deleteMovie(@Param('id') id: string) {
    return this.movieService.deleteMovie(id)
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }, { name: 'video' }]))
  update(
    @Param('id') id: string,
    @Body() data: CreateMovieDto,
    @UploadedFiles() files: { images: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    return this.movieService.update(id, data, files)
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }, { name: 'video' }]))
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFiles() files: { images: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    return this.movieService.create(createMovieDto, files)
  }

  // MOVIE FORMAT CONTROLLER
  @UseGuards(AdminGuard)
  @Post('format')
  createMovieFormat(@Body() { name }: { name: string }) {
    return this.movieService.createMovieFormat({ name })
  }

  @UseGuards(AdminGuard)
  @Put('format/:id')
  updateMovieFormat(@Param('id') id: string, @Body() { name }: { name: string }) {
    return this.movieService.updateMovieFormat(id, { name })
  }

  @UseGuards(AdminGuard)
  @Delete('format/:id')
  deleteMovieFormat(@Param('id') id: string) {
    return this.movieService.deleteMovieFormat(id)
  }

  // MOVIE TYPE CONTROLLER
  @UseGuards(AdminGuard)
  @Post('type')
  createMovieType(@Body() { name }: { name: string }) {
    return this.movieService.createMovieType({ name })
  }

  @UseGuards(AdminGuard)
  @Put('type/:id')
  updateMovieType(@Param('id') id: string, @Body() { name }: { name: string }) {
    return this.movieService.updateMovieType(id, { name })
  }

  @UseGuards(AdminGuard)
  @Delete('type/:id')
  deleteMovieType(@Param('id') id: string) {
    return this.movieService.deleteMovieType(id)
  }
}

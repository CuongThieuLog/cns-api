import {
  Body,
  Controller,
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
import { CreatePersonDto } from './dto/create-person.dto'
import { PersonService } from './person.service'

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  getAll() {
    return this.personService.list()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.personService.byId(id)
  }

  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  create(@Body() createPersonDto: CreatePersonDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.personService.create(createPersonDto, avatar)
  }

  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.personService.update(id, createPersonDto, avatar)
  }

  @UseGuards(AdminGuard)
  @Put(':id/delete')
  delete(@Param('id') id: string) {
    return this.personService.delete(id)
  }
}

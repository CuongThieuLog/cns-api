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
import { CreateProductDto } from './dto/create-product.dto'
import { ProductService } from './product.service'

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  list() {
    return this.productService.list()
  }

  @Get('/:id')
  byId(@Param('id') id: string) {
    return this.productService.byId(id)
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() data: CreateProductDto, @UploadedFile() image: Express.Multer.File) {
    return this.productService.create(data, image)
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.update(id, createProductDto, image)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id)
  }
}

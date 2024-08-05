import { Module } from '@nestjs/common'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

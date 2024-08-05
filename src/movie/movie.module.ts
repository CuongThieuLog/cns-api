import { Module } from '@nestjs/common'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
  imports: [PrismaModule, MovieModule, CloudinaryModule],
})
export class MovieModule {}

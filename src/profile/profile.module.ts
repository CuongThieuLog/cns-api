import { Module } from '@nestjs/common'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

import { Module } from '@nestjs/common'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PersonController } from './person.controller'
import { PersonService } from './person.service'

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}

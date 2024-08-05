import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { SeatModule } from 'src/seat/seat.module'
import { ScreenController } from './screen.controller'
import { ScreenService } from './screen.service'

@Module({
  imports: [PrismaModule, SeatModule],
  controllers: [ScreenController],
  providers: [ScreenService],
})
export class ScreenModule {}

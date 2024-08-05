import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { StatisticalController } from './statistical.controller'
import { StatisticalService } from './statistical.service'

@Module({
  imports: [PrismaModule],
  controllers: [StatisticalController],
  providers: [StatisticalService],
})
export class StatisticalModule {}

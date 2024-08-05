import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/guard/admin.guard'
import { GetByTime } from './dto/create-statistical.dto'
import { StatisticalService } from './statistical.service'
@ApiTags('statistical')
@Controller('statistical')
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {}

  @Get('revenue')
  getRevenueIn12Months() {
    return this.statisticalService.getTransactionInWeek()
  }

  @Get('revenue/week')
  @UseGuards(AdminGuard)
  getRevenueIn7Days() {
    return this.statisticalService.getTransactionInWeek()
  }

  @Get('revenue/by-time')
  @UseGuards(AdminGuard)
  getRevenueByTime(@Query() { start_time, end_time }: GetByTime) {
    return this.statisticalService.renderRevenueByStartTimeAndEndTime(start_time, end_time)
  }

  @Get('top-revenue')
  getTopRevenueInMonth() {
    return this.statisticalService.topRevenue()
  }

  @Get('top-movie')
  getTopMovieInMonth() {
    return this.statisticalService.top5MovieRevenueInMonth()
  }

  @Get('group')
  getTopMovieByTime() {
    return this.statisticalService.groupByMovie()
  }

  @Get('top-movie-revenue')
  getTopMovieRevenue() {
    return this.statisticalService.groupByMovie()
  }

  @Get('movie-type')
  getMovieType() {
    return this.statisticalService.getMovieType()
  }

  @Get('total')
  getTotal() {
    return this.statisticalService.getTotal()
  }
}

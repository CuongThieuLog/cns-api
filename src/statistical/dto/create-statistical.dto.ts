import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class GetByTime {
  @ApiProperty()
  @Type(() => Date)
  start_time: Date

  @ApiProperty()
  @Type(() => Date)
  end_time: Date
}

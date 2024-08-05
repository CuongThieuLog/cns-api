import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString, MinDate } from 'class-validator'

export class CreateScheduleDto {
  @ApiProperty()
  @Type(() => Date)
  @MinDate(new Date())
  @IsDate()
  start_time: Date

  @ApiProperty()
  @Type(() => Date)
  @MinDate(new Date())
  @IsDate()
  @IsNotEmpty()
  end_time: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  movie_id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  screen_id: string
}

import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSeatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  row: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  column: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  screen_id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum($Enums.SeatType)
  seat_type: $Enums.SeatType
}

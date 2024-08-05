import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateScreenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cinema_id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  column_size: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  row_size: number
}

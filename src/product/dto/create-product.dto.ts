import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  is_active: boolean
}

export class getByIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  id: string
}

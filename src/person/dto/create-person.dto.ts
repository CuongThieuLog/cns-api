import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreatePersonDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date_of_birth: Date

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  biography: string

  @IsNotEmpty()
  @IsEnum($Enums.Position)
  @ApiProperty()
  position: $Enums.Position
}

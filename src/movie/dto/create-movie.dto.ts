import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  national: string

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  released_date: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  language_movie: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  limit_age: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brief_movie: string

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  is_deleted: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  movie_type_id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  movie_format_id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  ticket_price: number

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  person_id: string[]
}

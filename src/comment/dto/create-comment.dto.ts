import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  movie_id: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  star: number

  @ApiProperty()
  @IsArray()
  feeling: string[]

  @ApiProperty()
  @IsArray()
  image: string[]
}

export class getByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  movie_id: string
}

export class DeleteCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string
}

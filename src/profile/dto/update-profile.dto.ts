import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(1)
  @ApiProperty()
  first_name: string

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(1)
  @ApiProperty()
  last_name: string

  @ApiProperty()
  phone_number?: string

  @ApiProperty()
  birthday?: Date

  @ApiProperty()
  address?: string

  @ApiProperty()
  role_user?: $Enums.RoleUser
}

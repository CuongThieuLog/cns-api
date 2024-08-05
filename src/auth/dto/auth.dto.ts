import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @ApiProperty()
  password: string

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
}

export class tokenDto {
  token: string
}

export class EmailRegisterDto {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsString()
  token: string
}

export class EmailForgotPasswordDto {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsString()
  token: string
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string
}

export class VerifyAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string
}

export class ResendVerifyAccountDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6)
  @ApiProperty()
  new_password: string
}

export class UserDto {
  id: string
  email: string
  email_verified?: Date
  first_name: string
  last_name: string
  phone_number?: string
  birthday?: Date
  address?: string
  avatar?: string
  role_user: $Enums.RoleUser
  created_at: Date
  updated_at: Date
}

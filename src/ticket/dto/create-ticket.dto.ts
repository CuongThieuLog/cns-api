import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  user_id: string

  @ApiProperty()
  @IsString()
  schedule_id: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsArray()
  foods?: string[]

  @ApiProperty()
  @IsEnum($Enums.PaymentStatus)
  payment_status: $Enums.PaymentStatus

  @ApiProperty()
  @IsArray()
  seats: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payment_intent_id: string
}

export class getByIdDto {
  @ApiProperty()
  @IsString()
  id: string
}

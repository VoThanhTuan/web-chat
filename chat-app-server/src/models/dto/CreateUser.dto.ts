import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString({ message: 'Nickname must be a string' })
  @MaxLength(255, { message: 'Nickname must be less than or equal to 255' })
  @IsNotEmpty({ message: 'Nickname cannot be empty' })
  nickname: string
}

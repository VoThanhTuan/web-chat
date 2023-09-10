import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateRoomDto {
  @IsString({ message: 'Room name must be a string' })
  @MaxLength(255, { message: 'Room name must be less than or equal to 255' })
  @IsNotEmpty({ message: 'Room name cannot be empty' })
  name: string

  // userId: number
}

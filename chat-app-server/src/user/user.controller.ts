import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './../models/dto/CreateUser.dto'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthPayload } from './../auth/interfaces/auth-payload.interface'
import * as moment from 'moment'
import { JwtService } from '@nestjs/jwt'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'create a new nickname if not exist, login into chat system',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          default: '',
        },
      },
      required: ['nickname'],
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto)

    const payload: AuthPayload = {
      name: user.nickname,
      id: user.id,
    }
    const expiresTime = 1

    return {
      expiresIn: moment().add(expiresTime, 'days'),
      token: this.jwtService.sign(payload),
      user,
    }
  }
}

import { Controller, Body, Post, Param, Get, Delete, UseGuards, Req } from '@nestjs/common'
import { ConversationService } from './chat.room.service'
import { Conversation } from '../models/entities/conversation.entity'
import { CreateRoomDto } from '../models/dto/CreateRoom.dto'
import { ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { User } from '../models/entities/user.entity'
import { AuthenticationGuard } from './../auth/guards/auth.guard'

@UseGuards(AuthenticationGuard)
@ApiBearerAuth()
@Controller('chatrooms')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post()
  @ApiOperation({
    summary: 'Create chat room name',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: '',
        },
      },
      required: ['name'],
    },
  })
  async create(@Req() req: any, @Body() createRoomDto: CreateRoomDto): Promise<Conversation> {
    const { id: userId } = req.user
    console.log('req user', req.user)
    return this.conversationService.createConversation(createRoomDto, userId)
  }

  @Get()
  async findAll(): Promise<Conversation[]> {
    return this.conversationService.findAll()
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string): Promise<void> {
    const { id: userId } = req.user
    return this.conversationService.delete(+id, userId)
  }

  @Get(':id/users')
  async findUsersByRoomId(@Param('id') id: string): Promise<User[]> {
    return this.conversationService.findUserByRoomId(+id)
  }
}

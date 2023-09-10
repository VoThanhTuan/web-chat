import { Controller, Body, Post, Param, Get, Delete, UseGuards, Req, Query } from '@nestjs/common'
import { ChatRoomService } from './chat.room.service'
import { MessageService } from './../message/message.service'
import { Conversation } from '../models/entities/conversation.entity'
import { CreateRoomDto } from '../models/dto/CreateRoom.dto'
import { ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { User } from '../models/entities/user.entity'
import { AuthenticationGuard } from './../auth/guards/auth.guard'

@UseGuards(AuthenticationGuard)
@ApiBearerAuth()
@Controller('chatrooms')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly messageService: MessageService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Create a chat room name',
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
    return this.chatRoomService.createChatRoom(createRoomDto, userId)
  }

  @ApiOperation({
    summary: 'Get all list of chat room',
  })
  @Get()
  async findAll(): Promise<Conversation[]> {
    return this.chatRoomService.findAll()
  }

  @ApiOperation({
    summary: 'Delete a chat room by id',
  })
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string): Promise<void> {
    const { id: userId } = req.user
    return this.chatRoomService.delete(+id, userId)
  }

  @ApiOperation({
    summary: 'Get a list of participants and whether they are connected or not',
  })
  @Get(':id/users')
  async findUsersByRoomId(@Param('id') id: string): Promise<User[]> {
    return this.chatRoomService.findUserByRoomId(+id)
  }

  @ApiOperation({
    summary: 'Retrieve messages in chunks, allowing users to load more messages as needed.',
  })
  @Get(':id/messages')
  async getMessagesInConversation(
    @Param('id') conversationId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const [messages, totalMessages] = await this.messageService.getMessagesInConversation(
      conversationId,
      page,
      pageSize,
    )

    const totalPages = Math.ceil(totalMessages / pageSize)

    // Include pagination information in the response
    return {
      messages,
      totalMessages,
      totalPages,
      currentPage: page,
    }
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from '../models/entities/message.entity'
import { UserService } from '../user/user.service'
import { ChatRoomService } from '../chatRoom/chat.room.service'
import { User } from '../models/entities/user.entity'
import { CreateUpdateMessage } from './../models/dto/CreateUpdateMessage'
import { NotFoundException } from '@nestjs/common'

const WEB_SOCKET_PORT = +process.env['WEB_SOCKET_PORT'] || 4006;
console.log("SERVICE_PORT: ", WEB_SOCKET_PORT);

@WebSocketGateway(WEB_SOCKET_PORT, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(
    @InjectRepository(Message) // Inject the Message repository
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly conversationService: ChatRoomService,
  ) {}

  async handleConnection(client: Socket) {
    const user = await this.getDataUserFromToken(client)
    user.isConnected = true
    await this.userService.update(user)
    console.log(`Client connected: ${client.id}`)
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getDataUserFromToken(client)
    user.isConnected = false
    await this.userService.update(user)
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: any) {
    const { roomId, userId } = payload
    const user = await this.userService.findOne(userId)
    if (!user) {
      return
    }
    const chatRoom = await this.conversationService.findById(roomId)
    if (!chatRoom) {
      return
    }

    // Check if the user is already in the chat room
    const userInRoom = chatRoom.users.find((u) => u.id === user.id)
    if (!userInRoom) {
      chatRoom.users.push(user)
      await this.conversationService.save(chatRoom)
    }
    client.join(roomId.toString())
    this.server.to(roomId.toString()).emit('joinedRoom', roomId)

    // Notify other participants in the room
    this.server.to(roomId.toString()).emit('userJoined', {
      userId: user.id,
      nickname: user.nickname,
      isConnected: true,
    })
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: CreateUpdateMessage) {
    const { roomId, text, userId, id: messageId } = payload
    const user = await this.userService.findOne(userId) // Assuming you have a user ID associated with the socket

    if (!user) {
      return
    }

    const chatRoom = await this.conversationService.findById(roomId)

    if (!chatRoom) {
      return
    }

    if (messageId) {
      let messageToUpdate = await this.messageRepository.findOneBy({
        id: messageId,
      })
      if (!messageToUpdate) {
        throw new NotFoundException(`Message id=[${messageId}] not found`)
      }
      // Update the message text and set 'edited' to true
      messageToUpdate.text = text
      messageToUpdate.edited = true
      await this.messageRepository.save(messageToUpdate)

      // Emit the edited message to all participants in the chat room
      this.server.to(roomId.toString()).emit('messageEdited', {
        userId: user.id,
        messageId: messageToUpdate.id,
        newText: text,
      })
    } else {
      // Create a new message
      const message = new Message()
      message.user = user
      message.conversation = chatRoom
      message.text = text
      await this.messageRepository.save(message)

      // Emit the new message to all participants in the chat room
      this.server.to(roomId.toString()).emit('message', {
        userId: user.id,
        messageId: message.id,
        text: text,
      })
    }
  }

  async getDataUserFromToken(client: Socket): Promise<User> {
    const authToken: any = client.handshake?.query?.token
    return await this.userService.getDataUserFromToken(authToken)
  }
}

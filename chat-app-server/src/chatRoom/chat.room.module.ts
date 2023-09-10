import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatRoomController } from './chat.room.controller'
import { ChatRoomService } from './chat.room.service'
import { Conversation } from '../models/entities/conversation.entity'
import { Message } from '../models/entities/message.entity'
import { UserModule } from '../user/user.module'
import { MessageModule } from '../message/message.module'
@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), UserModule, MessageModule], // Import the ChatRoom entity
  controllers: [ChatRoomController], // Register the ChatRoomController
  providers: [ChatRoomService], // Register the ChatRoomService
  exports: [ChatRoomService], // Export the ChatRoomService if needed by other modules
})
export class ChatRoomModule {}

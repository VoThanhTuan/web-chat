import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConversationController } from './chat.room.controller'
import { ConversationService } from './chat.room.service'
import { Conversation } from '../models/entities/conversation.entity'
import { Message } from '../models/entities/message.entity'
import { UserModule } from '../user/user.module'
@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), UserModule], // Import the ChatRoom entity
  controllers: [ConversationController], // Register the ChatRoomController
  providers: [ConversationService], // Register the ChatRoomService
  exports: [ConversationService], // Export the ChatRoomService if needed by other modules
})
export class ConversationModule {}

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module'; 
import { ConversationModule } from '../chatRoom/chat.room.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../models/entities/message.entity'
@Module({
  imports: [UserModule, ConversationModule, TypeOrmModule.forFeature([Message])], 
  providers: [ChatGateway], // Register the ChatGateway as a WebSocket Gateway
})
export class ChatGatewayModule {}

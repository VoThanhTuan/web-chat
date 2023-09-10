import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { UserModule } from '../user/user.module'
import { ChatRoomModule } from '../chatRoom/chat.room.module'
import { MessageModule } from '../message/message.module'
@Module({
  imports: [UserModule, ChatRoomModule, MessageModule],
  providers: [ChatGateway], // Register the ChatGateway as a WebSocket Gateway
})
export class ChatGatewayModule {}

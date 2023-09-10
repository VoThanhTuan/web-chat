import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { UserModule } from '../api/user/user.module'
import { ChatRoomModule } from '../api/chatRoom/chat.room.module'
import { MessageModule } from '../api/message/message.module'
@Module({
  imports: [UserModule, ChatRoomModule, MessageModule],
  providers: [ChatGateway], // Register the ChatGateway as a WebSocket Gateway
})
export class ChatGatewayModule {}

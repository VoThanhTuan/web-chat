import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './api/user/user.module' // Import your UsersModule here
import { ChatRoomModule } from './api/chatRoom/chat.room.module'
import { ChatGatewayModule } from './chatGateway/chat.gateway.module' // Import your ChatGatewayModule here
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './config/database.config'
import { AuthModule } from './auth/auth.module'
import { MessageModule } from './api/message/message.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    UserModule,
    ChatRoomModule,
    ChatGatewayModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

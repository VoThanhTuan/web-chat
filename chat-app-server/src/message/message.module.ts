import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageService } from './message.service'
import { Message } from '../models/entities/message.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Message])], // Import the ChatRoom entity
  providers: [MessageService], 
  exports: [MessageService], // Export the MessageService if needed by other modules
})
export class MessageModule {}
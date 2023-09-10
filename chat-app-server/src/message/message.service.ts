import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './../models/entities/message.entity'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getMessagesInConversation(
    conversationId: number,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<[Message[], number]> {
    const skip = (page - 1) * pageSize;

    const [messages, totalMessages] = await this.messageRepository.findAndCount({
      where: { conversation: { id: conversationId } }, // Use the relation
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return [messages, totalMessages];
  }
}

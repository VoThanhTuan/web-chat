import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Conversation } from '../models/entities/conversation.entity'
import { Message } from '../models/entities/message.entity'
import { User } from '../models/entities/user.entity'
import { CreateRoomDto } from '../models/dto/CreateRoom.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async createChatRoom(createRoomDto: CreateRoomDto, userId: string): Promise<Conversation> {
    const { name } = createRoomDto
    const user = await this.userService.findOne(+userId)
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const existedConversation = await this.conversationRepository.findOne({
      where: { name },
    })
    // check chat room exited or not
    if (existedConversation) {
      throw new BadRequestException(`Chat room name=[${name}] exited.`)
    }
    // Create a new room
    const conversation = this.conversationRepository.create({
      name,
      createdBy: +userId,
    })
    return this.conversationRepository.save(conversation)
  }

  async findById(id: number): Promise<Conversation | undefined> {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['users', 'messages'],
    })
  }

  async findByUserId(userId: number): Promise<Conversation[] | undefined> {
    return this.conversationRepository.find({
      where: { users: { id: userId } },
    })
  }

  async save(conversation: Conversation): Promise<void> {
    await this.conversationRepository.save(conversation)
  }

  async delete(id: number, userId: string): Promise<void> {
    // Find the chat room by ID
    const chatRoom = await this.conversationRepository.findOne({
      where: { id },
      relations: ['users', 'messages'],
    })

    if (!chatRoom) {
      throw new NotFoundException(`Chat room id=[${id}] does not found.`)
    }
    if (!chatRoom.createdBy || chatRoom.createdBy.toString() != userId) {
      throw new UnauthorizedException(`You don't have permission to delete room id=[${id}].`)
    }
    // Delete associated messages first
    await this.messageRepository.remove(chatRoom.messages)
    // Delete the chat room and cascade the deletion to related entities
    await this.conversationRepository.remove(chatRoom)
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationRepository.find()
  }

  async findUserByRoomId(id: number): Promise<User[]> {
    const chatRoom = await this.conversationRepository.findOne({
      where: { id },
      relations: ['users'],
    })
    if (!chatRoom) {
      throw new NotFoundException(`Room {Id} does not exist`)
    }
    return chatRoom.users
  }
}

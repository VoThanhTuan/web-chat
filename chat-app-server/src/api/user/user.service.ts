import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../models/entities/user.entity'
import { CreateUserDto } from '../../models/dto/CreateUser.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findByNickname(nickname: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { nickname } })
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let { nickname = '' } = createUserDto
    nickname = nickname.trim()

    // Check if the nickname already exists in the database
    const existingUser = await this.findByNickname(nickname)
    if (existingUser) {
      return existingUser
    }

    const user = this.userRepository.create({ nickname })
    return this.userRepository.save(user)
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id })
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user)
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user)
  }

  async getDataUserFromToken(authToken: any): Promise<User> {
    try {
      const decoded = this.jwtService.verify(authToken)
      return await this.findOne(decoded.id)
    } catch (ex) {
      throw new NotFoundException('User not found')
    }
  }

  getUserIdFromToken(authToken: any): number {
    const decoded = this.jwtService.verify(authToken)
    if (!decoded.id) {
      throw new BadRequestException('Invalid authorize token')
    }
    return decoded.id
  }
}

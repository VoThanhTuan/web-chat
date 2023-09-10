import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Conversation } from './conversation.entity'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  @Column()
  text: string

  @Column({ default: false }) // Add 'edited' field
  edited: boolean

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date
}

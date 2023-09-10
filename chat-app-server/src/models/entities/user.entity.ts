import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Message } from './message.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, nullable: false })
  @Column()
  @Index({ unique: true })
  nickname: string

  @Column({ name: 'is_connected', default: false }) // connected = true, not connect = false
  isConnected: boolean

  // @ManyToMany(() => Conversation, (conversation) => conversation.users)
  // @JoinTable({
  //   name: 'user_conversation',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'conversation_id' },
  // })
  // conversation: Conversation[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date
}

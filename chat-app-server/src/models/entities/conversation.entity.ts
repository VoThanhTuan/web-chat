import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { User } from './user.entity'
import { Message } from './message.entity'

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, nullable: false })
  @Index({ unique: true })
  name: string

  @ManyToMany(() => User, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_conversation',
    joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[]

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
    // orphanedRowAction: 'delete',
  })
  messages: Message[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date

  @Column({ name: 'created_by', nullable: false })
  createdBy: number
}

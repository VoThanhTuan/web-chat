import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from './../models/entities/user.entity'
import { AuthModule } from './../auth/auth.module'
import { EXPIRES_TIME, JWT_SECRET_KEY } from '../config/constants'
import { JwtModule } from '@nestjs/jwt'
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: EXPIRES_TIME },
    }),
  ],
  controllers: [UserController], // Register the UserController
  providers: [UserService], // Register the UserService
  exports: [UserService], // Export the UserService if needed by other modules
})
export class UserModule {}

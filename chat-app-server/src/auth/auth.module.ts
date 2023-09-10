import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { JsonWebTokenStrategy } from './strategies/jwt-strategy'

@Module({
  imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JsonWebTokenStrategy],
  exports: [PassportModule, JsonWebTokenStrategy],
})
export class AuthModule {}

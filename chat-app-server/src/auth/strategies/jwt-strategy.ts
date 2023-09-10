import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthPayload } from '../interfaces/auth-payload.interface'
import { JWT_SECRET_KEY } from '../../config/constants'

@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    })
  }

  async validate(payload: AuthPayload) {
    if (!payload) {
      throw new UnauthorizedException()
    }
    return { name: payload.name, id: payload.id }
  }
}

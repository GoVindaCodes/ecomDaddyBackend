// jwt.strategy.ts
/* Created By: Rahul 30-11-2023 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key', // Replace with your secret key
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

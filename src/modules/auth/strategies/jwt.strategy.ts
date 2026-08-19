import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_TYPE } from '../../../common/constants/system.constants';
import { AuthenticatedUser } from '../../../common/types/authenticated-user';

export interface AccessTokenPayload {
  sub: number;
  tenantId: number;
  email: string;
  type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  validate(payload: AccessTokenPayload): AuthenticatedUser {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      userId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
    };
  }
}

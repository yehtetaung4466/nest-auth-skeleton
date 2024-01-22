import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/utils/token.payload';
@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateTokens(sub: number) {
    const accessToken = this.getJwtAccessToken(sub);
    const refreshToken = this.getJwtRefreshToken(sub);
    return { accessToken, refreshToken };
  }
  private getJwtAccessToken(sub: number) {
    const payload: JwtPayload = { sub, type: 'access' };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      { expiresIn: '10d' },
    );
    return accessToken;
  }

  private getJwtRefreshToken(sub: number) {
    const payload: JwtPayload = { sub, type: 'refresh' };
    const refreshToken = jwt.sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      {
        expiresIn: '10d',
      },
    );
    return refreshToken;
  }
}

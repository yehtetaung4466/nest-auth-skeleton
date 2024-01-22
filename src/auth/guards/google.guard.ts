import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

export class GoogleGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}

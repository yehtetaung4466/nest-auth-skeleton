import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtService } from './jwt.service';
import { JwtRefreshStrategy } from './strategies/jwt.refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    JwtService,
    JwtRefreshStrategy,
  ],
  imports: [DrizzleModule],
})
export class AuthModule {}

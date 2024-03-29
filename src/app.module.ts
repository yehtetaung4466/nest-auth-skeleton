import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), UserModule],
})
export class AppModule {}

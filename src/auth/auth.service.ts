import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { passwords, strategies, users } from 'src/drizzle/schema';
import { JwtService } from './jwt.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(name: string, email: string, password: string) {
    const user = await this.drizzleService.db
      .insert(users)
      .values({ name, email })
      .returning()
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'users_email_unique') {
            throw new ConflictException('user already exit');
          } else {
            throw err;
          }
        }
      });
    const hash = await argon2.hash(password);
    await Promise.all([
      this.drizzleService.db
        .insert(strategies)
        .values({ strategy: 'local', user_id: user[0].id }),
      this.drizzleService.db
        .insert(passwords)
        .values({ password: hash, user_id: user[0].id }),
    ]).catch(async (err) => {
      console.log(err);
      this.drizzleService.db.delete(users).where(eq(users.id, user[0].id));
      this.drizzleService.db
        .delete(strategies)
        .where(eq(strategies.user_id, user[0].id));
      this.drizzleService.db.delete(passwords).where(eq(passwords, user[0].id));
      throw new InternalServerErrorException('error signing up');
    });
    return { msg: 'successfully signed up' };
  }
  async createUserOrUpdate(
    name: string,
    email: string,
    strategy: 'google' | 'github',
    profile?: string,
  ) {
    const user = await this.drizzleService.db
      .insert(users)
      .values({ name, email, profile })
      .returning()
      .catch(async (err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'users_email_unique') {
            const user = await this.drizzleService.db.query.users.findFirst({
              where: eq(users.email, email),
            });
            const userStrategy =
              await this.drizzleService.db.query.strategies.findFirst({
                where: eq(strategies.user_id, user.id),
              });
            if (userStrategy.strategy !== strategy)
              throw new ConflictException('email already taken');
            return [user];
          } else throw err;
        }
      });
    await this.drizzleService.db
      .insert(strategies)
      .values({ strategy, user_id: user[0].id })
      .onConflictDoNothing();
    return this.jwtService.generateTokens(user[0].id);
  }

  async login(email: string, password: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) throw new UnauthorizedException('invalid credentials');
    const db_pass = await this.drizzleService.db.query.passwords.findFirst({
      where: eq(passwords.user_id, user.id),
    });
    const verified = await argon2.verify(db_pass.password, password);
    if (!verified) throw new UnauthorizedException('invalid credentials');
    return this.jwtService.generateTokens(user.id);
  }
  async jwtRefresh(sub: number, expOfRefreshToken: number) {
    const currentTime = Date.now() / 1000;
    const diff = expOfRefreshToken - currentTime;
    const tokens = this.jwtService.generateTokens(sub);
    const twoDays = 2 * 60 * 60 * 24;
    return diff < twoDays
      ? { msg: 'refresh token is expiring soon thus issued a new one', tokens }
      : { accessToken: tokens.accessToken };
  }
}

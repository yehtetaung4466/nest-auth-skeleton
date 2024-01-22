import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
@Injectable()
export class DrizzleService {
  constructor(private readonly configService: ConfigService) {}
  private readonly connection = postgres(this.configService.get('DB_URL'));
  readonly db = drizzle(this.connection, { schema });
}

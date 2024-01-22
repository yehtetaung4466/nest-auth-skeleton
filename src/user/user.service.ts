import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';

@Injectable()
export class UserService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getUserById(id: number) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
}

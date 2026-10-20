import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Database, Tx } from './database';
import { TemporaryStore } from './redis';
export interface Actor {
  id: string;
  role: 'OWNER' | 'MANAGER' | 'VIEWER';
  session_version: number;
  property_ids: string[];
}
export interface SessionRecord {
  user_id: string;
  version: number;
  csrf: string;
}
@Injectable()
export class Access {
  constructor(
    readonly db: Database,
    readonly store: TemporaryStore,
  ) {}
  async login(
    email: string,
    password: string,
  ): Promise<{ id: string; csrf_token: string; actor: Actor }> {
    const user = await this.db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user?.enabled || !(await Bun.password.verify(password, user.password_hash)))
      throw new UnauthorizedException('Invalid credentials');
    const id = randomBytes(32).toString('base64url'),
      csrf_token = randomBytes(24).toString('base64url');
    await this.store.client.set(
      'session:' + id,
      JSON.stringify({ user_id: user.id, version: user.session_version, csrf: csrf_token }),
      'EX',
      28800,
    );
    return { id, csrf_token, actor: await this.actor(user.id) };
  }
  async authenticate(id: string): Promise<{ actor: Actor; session: SessionRecord }> {
    const data = await this.store.client.get('session:' + id);
    if (!data) throw new UnauthorizedException('Session expired');
    const session = JSON.parse(data) as SessionRecord;
    const actor = await this.actor(session.user_id);
    if (actor.session_version !== session.version)
      throw new UnauthorizedException('Session expired');
    return { actor, session };
  }
  async actor(id: string, tx: Tx = this.db): Promise<Actor> {
    const user = await tx.user.findUnique({ where: { id }, include: { grants: true } });
    if (!user?.enabled) throw new UnauthorizedException('Session expired');
    return {
      id: user.id,
      role: user.role,
      session_version: user.session_version,
      property_ids: user.grants.map((g) => g.property_id),
    };
  }
  async current(actor: Actor, tx: Tx = this.db): Promise<Actor> {
    const fresh = await this.actor(actor.id, tx);
    if (fresh.session_version !== actor.session_version)
      throw new UnauthorizedException('Session expired');
    return fresh;
  }
  property(actor: Actor, id: string) {
    if (actor.role === 'OWNER' || actor.property_ids.includes(id)) return;
    throw new ForbiddenException('Property access denied');
  }
  write(actor: Actor) {
    if (actor.role !== 'VIEWER') return;
    throw new ForbiddenException('Write access denied');
  }
  owner(actor: Actor) {
    if (actor.role === 'OWNER') return;
    throw new ForbiddenException('Owner access required');
  }
}

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  ForbiddenException,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Actor, SessionRecord } from './access';
import { Access } from './access';
import { Config } from './config';
import { TemporaryStore } from './redis';
import { timingSafeEqual } from 'node:crypto';
export interface AuthRequest extends Request {
  actor: Actor;
  session: SessionRecord;
  sessionId: string;
}
export function checkOrigin(origin: string | undefined, allowed: string) {
  if (origin !== allowed) throw new ForbiddenException('Request origin is not permitted');
}
export function checkCSRF(token: string | undefined, expected: string) {
  const given = Buffer.from(token || ''),
    required = Buffer.from(expected);
  if (!token || given.length !== required.length || !timingSafeEqual(given, required))
    throw new ForbiddenException('Refresh your session before saving');
}
export function safeError(status: number, message: string) {
  return { status_code: status, message };
}
@Catch()
export class ErrorBoundary implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = 500,
      message = 'Request failed. Please try again';
    if (error instanceof HttpException) {
      status = error.getStatus();
      const body = error.getResponse();
      const detail =
        typeof body === 'string' ? body : (body as { message?: string | string[] }).message;
      message = Array.isArray(detail) ? detail.join('; ') : detail || error.message;
    } else if (error && typeof error === 'object' && 'code' in error) {
      const code = String(error.code);
      if (code === 'P2002') {
        status = 409;
        message = 'A conflicting record already exists';
      } else if (code === 'P2025') {
        status = 404;
        message = 'Record not found';
      } else if (code === 'P2003') {
        status = 409;
        message = 'Related record does not exist';
      }
    }
    response.status(status).json(safeError(status, message));
  }
}
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private access: Access,
    private config: Config,
    private store: TemporaryStore,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const res = context.switchToHttp().getResponse();
    if (req.method === 'GET' && req.path === '/api/health') return true;
    const login = req.method === 'POST' && req.path === '/api/session';
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method))
      checkOrigin(req.get('origin'), this.config.origin);
    if (login) {
      await this.rate('login:' + req.ip, 10, res);
      return true;
    }
    const id =
      req.headers.cookie
        ?.split(';')
        .map((x) => x.trim())
        .find((x) => x.startsWith('rental_sid='))
        ?.slice(11) || '';
    const result = await this.access.authenticate(id);
    req.actor = result.actor;
    req.session = result.session;
    req.sessionId = id;
    await this.rate('user:' + req.actor.id, 120, res);
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method))
      checkCSRF(req.get('x-csrf-token'), result.session.csrf);
    return true;
  }
  private async rate(key: string, max: number, res: { setHeader: (k: string, v: string) => void }) {
    const limit = await this.store.limit(key, max);
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfter));
      throw new HttpException('Too many requests. Please wait', 429);
    }
  }
}

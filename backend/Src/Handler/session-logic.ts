import { Body, Controller, Delete, Get, Post, Req, Res, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCookieAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginInput, SessionView, SuccessView } from '../Contracts/session.contract';
import { Access } from '../Infrastructure/access';
import { Config } from '../Infrastructure/config';
import { SessionManager } from '../../Managers/session-manager';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('session')
@ApiCookieAuth()
export class SessionLogic {
  constructor(
    private access: Access,
    private sessions: SessionManager,
    private config: Config,
  ) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({ operationId: 'login' })
  @ApiOkResponse({ type: SessionView })
  async login(@Body() input: LoginInput, @Res({ passthrough: true }) res: Response) {
    const session = await this.access.login(input.email, input.password);
    res.cookie('rental_sid', session.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.origin.startsWith('https:'),
      maxAge: 28800000,
      path: '/api',
    });
    return this.sessions.view(session.actor, session.csrf_token);
  }
  @Get()
  @ApiOperation({ operationId: 'getSession' })
  @ApiOkResponse({ type: SessionView })
  get(@Req() req: AuthRequest) {
    return this.sessions.view(req.actor, req.session.csrf);
  }
  @Delete()
  @ApiOperation({ operationId: 'logout' })
  @ApiOkResponse({ type: SuccessView })
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    await this.access.store.client.del('session:' + req.sessionId);
    res.clearCookie('rental_sid', { path: '/api' });
    return { ok: true };
  }
}

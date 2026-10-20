import { Body, Controller, Get, Post, Patch, Param, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { UsersManager } from '../../Managers/users-manager';
import { SessionManager } from '../../Managers/session-manager';
import {
  CreateUserInput,
  UpdateUserInput,
  PasswordInput,
  UserView,
  UserList,
} from '../Contracts/user.contract';
import { SuccessView } from '../Contracts/session.contract';
import { ListQuery } from '../Contracts/common.contract';
import { paginate } from '../Infrastructure/rules';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('users')
@ApiCookieAuth()
export class UsersLogic {
  constructor(
    private users: UsersManager,
    private sessions: SessionManager,
  ) {}
  @Get() @ApiOperation({ operationId: 'listUsers' }) @ApiOkResponse({ type: UserList }) async list(
    @Req() req: AuthRequest,
    @Query() query: ListQuery,
  ) {
    return paginate(await this.users.list(req.actor), query, await this.sessions.date());
  }
  @Post()
  @ApiOperation({ operationId: 'createUser' })
  @ApiCreatedResponse({ type: UserView })
  create(@Req() req: AuthRequest, @Body() body: CreateUserInput) {
    return this.users.create(req.actor, body);
  }
  @Patch(':id')
  @ApiOperation({ operationId: 'updateUser' })
  @ApiOkResponse({ type: UserView })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: UpdateUserInput) {
    return this.users.update(req.actor, id, body);
  }
  @Post(':id/password')
  @ApiOperation({ operationId: 'resetUserPassword' })
  @ApiCreatedResponse({ type: SuccessView })
  password(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: PasswordInput) {
    return this.users.password(req.actor, id, body.password);
  }
}

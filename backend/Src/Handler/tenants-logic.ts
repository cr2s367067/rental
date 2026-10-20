import { Body, Controller, Get, Post, Patch, Param, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { TenantsManager } from '../../Managers/tenants-manager';
import {
  CreateTenantInput,
  UpdateTenantInput,
  TenantView,
  TenantList,
} from '../Contracts/stay.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('tenants')
@ApiCookieAuth()
export class TenantsLogic {
  constructor(private tenants: TenantsManager) {}
  @Get() @ApiOperation({ operationId: 'listTenants' }) @ApiOkResponse({ type: TenantList }) list(
    @Req() req: AuthRequest,
    @Query() query: ListQuery,
  ) {
    return this.tenants.list(req.actor, query);
  }
  @Get(':id') @ApiOperation({ operationId: 'getTenant' }) @ApiOkResponse({ type: TenantView }) get(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: ListQuery,
  ) {
    return this.tenants.get(req.actor, id, query);
  }
  @Post()
  @ApiOperation({ operationId: 'createTenant' })
  @ApiCreatedResponse({ type: TenantView })
  create(@Req() req: AuthRequest, @Body() body: CreateTenantInput) {
    return this.tenants.create(req.actor, body);
  }
  @Patch(':id')
  @ApiOperation({ operationId: 'updateTenant' })
  @ApiOkResponse({ type: TenantView })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: UpdateTenantInput) {
    return this.tenants.update(req.actor, id, body);
  }
}

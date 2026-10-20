import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCookieAuth } from '@nestjs/swagger';
import { DashboardManager } from '../../Managers/dashboard-manager';
import { DashboardQuery, DashboardView } from '../Contracts/dashboard.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('dashboard')
@ApiCookieAuth()
export class DashboardLogic {
  constructor(private dashboard: DashboardManager) {}
  @Get() @ApiOperation({ operationId: 'getDashboard' }) @ApiOkResponse({ type: DashboardView }) get(
    @Req() req: AuthRequest,
    @Query() query: DashboardQuery,
  ) {
    return this.dashboard.get(req.actor, query);
  }
}

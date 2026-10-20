import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCookieAuth } from '@nestjs/swagger';
import { StaysManager } from '../../Managers/stays-manager';
import { StayList } from '../Contracts/stay.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('stays')
@ApiCookieAuth()
export class StaysLogic {
  constructor(private stays: StaysManager) {}
  @Get() @ApiOperation({ operationId: 'listStays' }) @ApiOkResponse({ type: StayList }) list(
    @Req() req: AuthRequest,
    @Query() query: ListQuery,
  ) {
    return this.stays.list(req.actor, query);
  }
}

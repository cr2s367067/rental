import { Body, Controller, Get, Post, Patch, Param, Req, Query, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { ContractsManager } from '../../Managers/contracts-manager';
import {
  CreateContractInput,
  UpdateContractInput,
  TerminationInput,
  ContractView,
  ContractList,
} from '../Contracts/contract.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('contracts')
@ApiCookieAuth()
export class ContractsLogic {
  constructor(private contracts: ContractsManager) {}
  @Get()
  @ApiOperation({ operationId: 'listContracts' })
  @ApiOkResponse({ type: ContractList })
  list(@Req() req: AuthRequest, @Query() query: ListQuery) {
    return this.contracts.list(req.actor, query);
  }
  @Get(':id')
  @ApiOperation({ operationId: 'getContract' })
  @ApiOkResponse({ type: ContractView })
  get(@Req() req: AuthRequest, @Param('id') id: string, @Query() query: ListQuery) {
    return this.contracts.get(req.actor, id, query);
  }
  @Post()
  @ApiOperation({ operationId: 'createContract' })
  @ApiCreatedResponse({ type: ContractView })
  create(@Req() req: AuthRequest, @Body() body: CreateContractInput) {
    return this.contracts.create(req.actor, body);
  }
  @Patch(':id')
  @ApiOperation({ operationId: 'updateContract' })
  @ApiOkResponse({ type: ContractView })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: UpdateContractInput) {
    return this.contracts.update(req.actor, id, body);
  }
  @Post(':id/termination')
  @HttpCode(200)
  @ApiOperation({ operationId: 'terminateContract' })
  @ApiOkResponse({ type: ContractView })
  terminate(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: TerminationInput) {
    return this.contracts.terminate(req.actor, id, body);
  }
}

import { Body, Controller, Get, Post, Patch, Param, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { PropertiesManager } from '../../Managers/properties-manager';
import {
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyView,
  PropertyList,
} from '../Contracts/property.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller('properties')
@ApiCookieAuth()
export class PropertiesLogic {
  constructor(private properties: PropertiesManager) {}
  @Get()
  @ApiOperation({ operationId: 'listProperties' })
  @ApiOkResponse({ type: PropertyList })
  list(@Req() req: AuthRequest, @Query() query: ListQuery) {
    return this.properties.list(req.actor, query);
  }
  @Get(':id')
  @ApiOperation({ operationId: 'getProperty' })
  @ApiOkResponse({ type: PropertyView })
  get(@Req() req: AuthRequest, @Param('id') id: string, @Query() query: ListQuery) {
    return this.properties.get(req.actor, id, query);
  }
  @Post()
  @ApiOperation({ operationId: 'createProperty' })
  @ApiCreatedResponse({ type: PropertyView })
  create(@Req() req: AuthRequest, @Body() body: CreatePropertyInput) {
    return this.properties.create(req.actor, body);
  }
  @Patch(':id')
  @ApiOperation({ operationId: 'updateProperty' })
  @ApiOkResponse({ type: PropertyView })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: UpdatePropertyInput) {
    return this.properties.update(req.actor, id, body);
  }
}

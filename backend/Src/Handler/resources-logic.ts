import { Body, Controller, Get, Post, Patch, Param, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { PropertiesManager } from '../../Managers/properties-manager';
import {
  CreateResourceInput,
  UpdateResourceInput,
  ResourceView,
  ResourceList,
} from '../Contracts/property.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
@Controller()
@ApiCookieAuth()
export class ResourcesLogic {
  constructor(private properties: PropertiesManager) {}
  @Get('resources')
  @ApiOperation({ operationId: 'listAllResources' })
  @ApiOkResponse({ type: ResourceList })
  all(@Req() req: AuthRequest, @Query() query: ListQuery) {
    return this.properties.resources(req.actor, query);
  }
  @Get('properties/:id/resources')
  @ApiOperation({ operationId: 'listResources' })
  @ApiOkResponse({ type: ResourceList })
  list(@Req() req: AuthRequest, @Param('id') id: string, @Query() query: ListQuery) {
    return this.properties.resources(req.actor, { ...query, property_id: id });
  }
  @Post('properties/:id/resources')
  @ApiOperation({ operationId: 'createResource' })
  @ApiCreatedResponse({ type: ResourceView })
  create(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: CreateResourceInput) {
    return this.properties.createResource(req.actor, id, body);
  }
  @Patch('resources/:id')
  @ApiOperation({ operationId: 'updateResource' })
  @ApiOkResponse({ type: ResourceView })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: UpdateResourceInput) {
    return this.properties.updateResource(req.actor, id, body);
  }
}

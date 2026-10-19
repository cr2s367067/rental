import {Body,Controller,Put,Param,Req} from '@nestjs/common';import {ApiOperation,ApiOkResponse,ApiCookieAuth} from '@nestjs/swagger';import {UsersManager} from '../../Managers/users-manager';import {GrantsInput,OwnerInput,OwnershipView} from '../Contracts/property-access.contract';import {UserView} from '../Contracts/user.contract';import type {AuthRequest} from '../Infrastructure/transport';
@Controller() @ApiCookieAuth()
export class PropertyAccessLogic {
 constructor(private users:UsersManager){}
 @Put('users/:id/property-access') @ApiOperation({operationId:'replacePropertyGrants'}) @ApiOkResponse({type:UserView}) grants(@Req() req:AuthRequest,@Param('id') id:string,@Body() body:GrantsInput){return this.users.grants(req.actor,id,body);}
 @Put('properties/:id/owner') @ApiOperation({operationId:'assignPropertyOwner'}) @ApiOkResponse({type:OwnershipView}) owner(@Req() req:AuthRequest,@Param('id') id:string,@Body() body:OwnerInput){return this.users.owner(req.actor,id,body);}
}

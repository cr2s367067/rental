import {Body,Controller,Get,Patch,Post,Req} from '@nestjs/common';import {ApiOperation,ApiOkResponse,ApiCreatedResponse,ApiCookieAuth} from '@nestjs/swagger';import {DemoManager} from '../../Managers/demo-manager';import {DemoDateInput,DemoContextView} from '../Contracts/demo-context.contract';import {SuccessView} from '../Contracts/session.contract';import type {AuthRequest} from '../Infrastructure/transport';
@Controller('demo') @ApiCookieAuth()
export class DemoLogic {
 constructor(private demo:DemoManager){}
 @Get('context') @ApiOperation({operationId:'getDemoContext'}) @ApiOkResponse({type:DemoContextView}) read(@Req() req:AuthRequest){return this.demo.read(req.actor);}
 @Patch('context') @ApiOperation({operationId:'setDemoDate'}) @ApiOkResponse({type:DemoContextView}) date(@Req() req:AuthRequest,@Body() body:DemoDateInput){return this.demo.date(req.actor,body.business_date);}
 @Post('reset') @ApiOperation({operationId:'resetDemo'}) @ApiCreatedResponse({type:SuccessView}) reset(@Req() req:AuthRequest){return this.demo.reset(req.actor);}
}

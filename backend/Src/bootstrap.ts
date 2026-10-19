import 'reflect-metadata';import {NestFactory} from '@nestjs/core';import {ValidationPipe} from '@nestjs/common';import type {NestExpressApplication} from '@nestjs/platform-express';import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';import {AppModule} from './app.module';import {ErrorBoundary} from './Infrastructure/transport';
export async function createApplication(){
 const app=await NestFactory.create<NestExpressApplication>(AppModule,{logger:false});app.setGlobalPrefix('api');app.useBodyParser('json',{limit:'1mb'});
 app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalFilters(new ErrorBoundary());
 app.use((_req:unknown,res:{setHeader:(k:string,v:string)=>void},next:()=>void)=>{res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');next();});
 app.enableShutdownHooks();return app;
}
export function schema(app:Awaited<ReturnType<typeof createApplication>>){
 const doc=SwaggerModule.createDocument(app,new DocumentBuilder().setTitle('Property Management Demo').setVersion('1.0.0').addCookieAuth('rental_sid').build());
 for(const path of Object.values(doc.paths))for(const op of Object.values(path||{}))if(op&&typeof op==='object'&&'responses' in op){
  for(const status of [400,401,403,404,409,413,415,422,429])op.responses[String(status)]={description:({400:'Malformed request',401:'Session expired',403:'Access denied',404:'Record not found',409:'Conflicting change',413:'Upload too large',415:'Unsupported content',422:'Invalid business fields',429:'Rate limit'} as Record<number,string>)[status],content:{'application/json':{schema:{type:'object',required:['status_code','message'],properties:{status_code:{type:'integer'},message:{type:'string'}}}}}};
 }
 return doc;
}

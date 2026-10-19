import {ConflictException,NotFoundException,UnprocessableEntityException} from '@nestjs/common';
export function exists<T>(value:T|null,description='Record'):T{if(value===null)throw new NotFoundException(description+' not found');return value;}
export function version(record:{version:number},expected:number){if(record.version!==expected)throw new ConflictException('This record changed. Refresh before saving');}
export function invalid(message:string):never{throw new UnprocessableEntityException(message);}
export function dateOnly(value:Date){return value.toISOString().slice(0,10);}
export function paginate<T>(items:T[],query:{page?:number;page_size?:number},business_date:string){const page=query.page||1,page_size=query.page_size||20;return {items:items.slice((page-1)*page_size,page*page_size),total:items.length,page,page_size,business_date};}

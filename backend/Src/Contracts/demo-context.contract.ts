import {ApiProperty} from '@nestjs/swagger';import {IsDateString,Matches} from 'class-validator';
export class DemoDateInput {@ApiProperty({format:'date'}) @IsDateString({strict:true}) @Matches(/^\d{4}-\d{2}-\d{2}$/) business_date!:string;}
export class DemoContextView {@ApiProperty({format:'date'}) business_date!:string;@ApiProperty() timezone!:string;@ApiProperty() demo_mode!:boolean;}

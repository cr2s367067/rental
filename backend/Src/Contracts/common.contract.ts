import {ApiProperty,ApiPropertyOptional} from '@nestjs/swagger';import {IsInt,Min,Max,IsOptional,IsString,IsDateString,Matches,MaxLength,IsIn} from 'class-validator';import {Type} from 'class-transformer';
export class VersionInput {@ApiProperty({minimum:1}) @IsInt() @Min(1) version!:number;}
export class ListQuery {
 @ApiPropertyOptional({default:1}) @IsOptional() @Type(()=>Number) @IsInt() @Min(1) page:number=1;
 @ApiPropertyOptional({default:20,maximum:100}) @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(100) page_size:number=20;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) property_id?:string;
 @ApiPropertyOptional({format:'date'}) @IsOptional() @IsDateString({strict:true}) @Matches(/^\d{4}-\d{2}-\d{2}$/) business_date?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) tenant_id?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) resource_id?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) contract_id?:string;
 @ApiPropertyOptional({enum:['total_properties','total_resources','occupied_resources','available_resources','current_tenants','upcoming_contract_starts','upcoming_contract_ends','unpaid_rent_periods','contracts_expiring']}) @IsOptional() @IsIn(['total_properties','total_resources','occupied_resources','available_resources','current_tenants','upcoming_contract_starts','upcoming_contract_ends','unpaid_rent_periods','contracts_expiring']) metric?:string;
}
export class PageView {@ApiProperty() total!:number;@ApiProperty() page!:number;@ApiProperty() page_size!:number;@ApiProperty({format:'date'}) business_date!:string;}

import {ApiProperty,PartialType,OmitType} from '@nestjs/swagger';import {IsEmail,IsString,IsIn,IsBoolean,MinLength,MaxLength,IsOptional,IsInt,Min} from 'class-validator';import {PageView} from './common.contract';
export class CreateUserInput {
 @ApiProperty() @IsEmail() @MaxLength(254) email!:string;
 @ApiProperty() @IsString() @MinLength(1) @MaxLength(100) display_name!:string;
 @ApiProperty({enum:['OWNER','MANAGER','VIEWER']}) @IsIn(['OWNER','MANAGER','VIEWER']) role!:'OWNER'|'MANAGER'|'VIEWER';
 @ApiProperty({default:true}) @IsOptional() @IsBoolean() enabled?:boolean;
 @ApiProperty({writeOnly:true,minLength:12}) @IsString() @MinLength(12) @MaxLength(256) password!:string;
}
export class UpdateUserInput extends PartialType(OmitType(CreateUserInput,['password'] as const)) {@ApiProperty({minimum:1}) @IsInt() @Min(1) version!:number;}
export class PasswordInput {@ApiProperty({writeOnly:true,minLength:12}) @IsString() @MinLength(12) @MaxLength(256) password!:string;}
export class UserView {@ApiProperty() id!:string;@ApiProperty() email!:string;@ApiProperty() display_name!:string;@ApiProperty({enum:['OWNER','MANAGER','VIEWER']}) role!:'OWNER'|'MANAGER'|'VIEWER';@ApiProperty() enabled!:boolean;@ApiProperty() version!:number;@ApiProperty({type:[String]}) property_ids!:string[];}
export class UserList extends PageView {@ApiProperty({type:[UserView]}) items!:UserView[];}

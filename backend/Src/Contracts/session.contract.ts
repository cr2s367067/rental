import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class LoginInput {
  @ApiProperty({ example: 'owner@example.test' }) @IsEmail() @MaxLength(254) email!: string;
  @ApiProperty({ writeOnly: true, minLength: 12 })
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  password!: string;
}
export class SessionProperty {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() owner_user_id!: string;
  @ApiProperty() version!: number;
}
export class SessionUser {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() display_name!: string;
  @ApiProperty({ enum: ['OWNER', 'MANAGER', 'VIEWER'] }) role!: 'OWNER' | 'MANAGER' | 'VIEWER';
}
export class SessionView {
  @ApiProperty({ type: SessionUser }) user!: SessionUser;
  @ApiProperty({ type: [SessionProperty] }) properties!: SessionProperty[];
  @ApiProperty() csrf_token!: string;
  @ApiProperty({ format: 'date' }) business_date!: string;
  @ApiProperty({ example: 'Asia/Taipei' }) timezone!: string;
  @ApiProperty() demo_mode!: boolean;
}
export class ErrorView {
  @ApiProperty() status_code!: number;
  @ApiProperty() message!: string;
}
export class SuccessView {
  @ApiProperty() ok!: boolean;
}

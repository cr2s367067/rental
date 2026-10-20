import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsEmail, IsInt, Min } from 'class-validator';
import { PageView, Trimmed } from './common.contract';
export class CreateTenantInput {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(150) @Trimmed() name!: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;
}
export class UpdateTenantInput extends PartialType(CreateTenantInput, {
  skipNullProperties: false,
}) {
  @ApiProperty() @IsInt() @Min(1) version!: number;
}
export class StayView {
  @ApiProperty() id!: string;
  @ApiProperty() contract_id!: string;
  @ApiProperty() tenant_id!: string;
  @ApiProperty() tenant_name!: string;
  @ApiProperty() resource_id!: string;
  @ApiProperty() resource_name!: string;
  @ApiProperty() property_id!: string;
  @ApiProperty() property_name!: string;
  @ApiProperty({ format: 'date' }) start_date!: string;
  @ApiProperty({ format: 'date' }) end_date!: string;
  @ApiProperty({ format: 'date' }) effective_end_date!: string;
  @ApiProperty({ format: 'date', type: String, nullable: true }) termination_date!: string | null;
  @ApiProperty({ enum: ['Current', 'Upcoming', 'Ended'] }) status!:
    | 'Current'
    | 'Upcoming'
    | 'Ended';
}
export class TenantView {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ type: String, nullable: true }) email!: string | null;
  @ApiProperty({ type: String, nullable: true }) phone!: string | null;
  @ApiProperty() version!: number;
  @ApiProperty({ type: [StayView] }) contracts!: StayView[];
}
export class TenantList extends PageView {
  @ApiProperty({ type: [TenantView] }) items!: TenantView[];
}
export class StayList extends PageView {
  @ApiProperty({ type: [StayView] }) items!: StayView[];
}

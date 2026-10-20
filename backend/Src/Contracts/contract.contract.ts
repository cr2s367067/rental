import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsDateString,
  Matches,
  IsInt,
  Min,
  Max,
  IsOptional,
  ValidateNested,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  type ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTenantInput, StayView } from './stay.contract';
import { PageView, VersionInput, OptionalValue } from './common.contract';
@ValidatorConstraint({ name: 'oneTenant', async: false })
class OneTenant implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const input = args.object as CreateContractInput;
    return !!input.tenant_id !== !!input.new_tenant;
  }
  defaultMessage() {
    return 'Choose exactly one existing tenant or new tenant contact';
  }
}
export class ContractTerms {
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  start_date!: string;
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  end_date!: string;
  @ApiProperty({ type: String, pattern: '^(0|[1-9][0-9]{0,11})$' })
  @IsString()
  @Matches(/^(0|[1-9]\d{0,11})$/)
  monthly_rent_twd!: string;
  @ApiProperty({ type: String, pattern: '^(0|[1-9][0-9]{0,11})$' })
  @IsString()
  @Matches(/^(0|[1-9]\d{0,11})$/)
  deposit_twd!: string;
  @ApiProperty({ minimum: 1, maximum: 28 }) @IsInt() @Min(1) @Max(28) due_day!: number;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  primary_document_id?: string | null;
}
export class CreateContractInput extends ContractTerms {
  @ApiProperty() @IsString() @MinLength(1) @Validate(OneTenant) resource_id!: string;
  @ApiPropertyOptional() @OptionalValue() @IsString() @MinLength(1) tenant_id?: string;
  @ApiPropertyOptional({ type: CreateTenantInput })
  @OptionalValue()
  @ValidateNested()
  @Type(() => CreateTenantInput)
  new_tenant?: CreateTenantInput;
}
export class UpdateContractInput extends PartialType(ContractTerms, { skipNullProperties: false }) {
  @ApiProperty() @IsInt() @Min(1) version!: number;
  @ApiPropertyOptional() @OptionalValue() @IsString() @MinLength(1) resource_id?: string;
  @ApiPropertyOptional() @OptionalValue() @IsString() @MinLength(1) tenant_id?: string;
}
export class TerminationInput extends VersionInput {
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  termination_date!: string;
}
export class ContractView extends OmitType(StayView, ['status'] as const) {
  @ApiProperty({ enum: ['Upcoming', 'Active', 'Expiring Soon', 'Expired', 'Terminated'] }) status!:
    | 'Upcoming'
    | 'Active'
    | 'Expiring Soon'
    | 'Expired'
    | 'Terminated';
  @ApiProperty({ type: String }) monthly_rent_twd!: string;
  @ApiProperty({ type: String }) deposit_twd!: string;
  @ApiProperty() due_day!: number;
  @ApiProperty({ type: String, nullable: true }) primary_document_id!: string | null;
  @ApiProperty() version!: number;
}
export class ContractList extends PageView {
  @ApiProperty({ type: [ContractView] }) items!: ContractView[];
}

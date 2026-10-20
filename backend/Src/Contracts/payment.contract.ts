import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches, IsDateString, IsIn, IsOptional } from 'class-validator';
import { PageView, OptionalValue } from './common.contract';
export class CreateObligationInput {
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  period_start!: string;
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  period_end!: string;
  @ApiProperty({ format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  due_date!: string;
  @ApiProperty({ type: String, pattern: '^(0|[1-9][0-9]{0,11})$' })
  @IsString()
  @Matches(/^(0|[1-9]\d{0,11})$/)
  amount_due_twd!: string;
  @ApiProperty({ enum: ['FULL_MONTH', 'MANUAL_PARTIAL_PERIOD'] })
  @IsIn(['FULL_MONTH', 'MANUAL_PARTIAL_PERIOD'])
  entry_mode!: 'FULL_MONTH' | 'MANUAL_PARTIAL_PERIOD';
}
export class RecordPaymentInput {
  @ApiProperty({ type: String, pattern: '^[1-9][0-9]{0,11}$' })
  @IsString()
  @Matches(/^[1-9]\d{0,11}$/)
  amount_twd!: string;
}
export class ReversePaymentInput {
  @ApiPropertyOptional({ type: String, pattern: '^[1-9][0-9]{0,11}$' })
  @OptionalValue()
  @IsString()
  @Matches(/^[1-9]\d{0,11}$/)
  replacement_amount_twd?: string;
}
export class PaymentView {
  @ApiProperty() id!: string;
  @ApiProperty() obligation_id!: string;
  @ApiProperty({ type: String }) amount_twd!: string;
  @ApiProperty({ enum: ['PAYMENT', 'REVERSAL'] }) kind!: 'PAYMENT' | 'REVERSAL';
  @ApiProperty({ type: String, nullable: true }) reverses_payment_id!: string | null;
  @ApiProperty({ type: String, nullable: true }) reversal_id!: string | null;
  @ApiProperty({ format: 'date-time' }) recorded_at!: string;
}
export class ObligationView {
  @ApiProperty() id!: string;
  @ApiProperty() contract_id!: string;
  @ApiProperty() tenant_id!: string;
  @ApiProperty() tenant_name!: string;
  @ApiProperty() resource_id!: string;
  @ApiProperty() resource_name!: string;
  @ApiProperty() property_id!: string;
  @ApiProperty() property_name!: string;
  @ApiProperty({ format: 'date' }) period_start!: string;
  @ApiProperty({ format: 'date' }) period_end!: string;
  @ApiProperty({ format: 'date' }) due_date!: string;
  @ApiProperty({ enum: ['FULL_MONTH', 'MANUAL_PARTIAL_PERIOD'] }) entry_mode!:
    | 'FULL_MONTH'
    | 'MANUAL_PARTIAL_PERIOD';
  @ApiProperty({ type: String }) amount_due_twd!: string;
  @ApiProperty({ type: String }) amount_paid_twd!: string;
  @ApiProperty({ type: String }) outstanding_twd!: string;
  @ApiProperty({ enum: ['Paid', 'Overdue', 'Partial Payment', 'Unpaid'] }) status!:
    | 'Paid'
    | 'Overdue'
    | 'Partial Payment'
    | 'Unpaid';
  @ApiProperty() is_partial!: boolean;
  @ApiProperty({ type: [PaymentView] }) payments!: PaymentView[];
}
export class ObligationList extends PageView {
  @ApiProperty({ type: [ObligationView] }) items!: ObligationView[];
}
export class PaymentAdjustmentView {
  @ApiProperty({ type: PaymentView }) reversal!: PaymentView;
  @ApiProperty({ type: PaymentView, nullable: true }) replacement!: PaymentView | null;
}
import { ListQuery } from './common.contract';
export class ObligationQuery extends ListQuery {
  @ApiPropertyOptional({ enum: ['Paid', 'Overdue', 'Partial Payment', 'Unpaid'] })
  @OptionalValue()
  @IsIn(['Paid', 'Overdue', 'Partial Payment', 'Unpaid'])
  status?: 'Paid' | 'Overdue' | 'Partial Payment' | 'Unpaid';
}

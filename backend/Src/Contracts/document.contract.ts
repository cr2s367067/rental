import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional, MinLength } from 'class-validator';
import { PageView, OptionalValue } from './common.contract';
export class UploadDocumentInput {
  @ApiProperty({ enum: ['CONTRACT', 'TENANT', 'RECEIPT', 'PROPERTY'] })
  @IsIn(['CONTRACT', 'TENANT', 'RECEIPT', 'PROPERTY'])
  kind!: 'CONTRACT' | 'TENANT' | 'RECEIPT' | 'PROPERTY';
  @ApiProperty() @IsString() @MinLength(1) property_id!: string;
  @ApiPropertyOptional() @OptionalValue() @IsString() contract_id?: string;
  @ApiPropertyOptional() @OptionalValue() @IsString() tenant_id?: string;
  @ApiPropertyOptional() @OptionalValue() @IsString() payment_id?: string;
  @ApiProperty({ type: 'string', format: 'binary' }) @OptionalValue() file?: unknown;
}
export class DocumentView {
  @ApiProperty() id!: string;
  @ApiProperty() kind!: string;
  @ApiProperty() property_id!: string;
  @ApiProperty({ type: String, nullable: true }) tenant_id!: string | null;
  @ApiProperty({ type: String, nullable: true }) contract_id!: string | null;
  @ApiProperty({ type: String, nullable: true }) payment_id!: string | null;
  @ApiProperty() file_name!: string;
  @ApiProperty() file_type!: string;
  @ApiProperty() mime_type!: string;
  @ApiProperty() size_bytes!: number;
  @ApiProperty({ format: 'date-time' }) uploaded_at!: string;
  @ApiProperty() sha256!: string;
}
export class DocumentList extends PageView {
  @ApiProperty({ type: [DocumentView] }) items!: DocumentView[];
}
import { ListQuery } from './common.contract';
export class DocumentQuery extends ListQuery {
  @ApiPropertyOptional() @OptionalValue() @IsString() payment_id?: string;
}

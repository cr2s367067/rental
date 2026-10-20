import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsIn, IsInt, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator';
import { PageView, OptionalValue, Trimmed } from './common.contract';
export class CreatePropertyInput {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(150) @Trimmed() name!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(100) @Trimmed() city!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(300) @Trimmed() address!: string;
  @ApiProperty() @IsString() @MinLength(1) owner_user_id!: string;
  @ApiProperty({ enum: ['ROOMS', 'WHOLE_PROPERTY'] })
  @IsIn(['ROOMS', 'WHOLE_PROPERTY'])
  rental_mode!: 'ROOMS' | 'WHOLE_PROPERTY';
}
export class UpdatePropertyInput extends PartialType(CreatePropertyInput, {
  skipNullProperties: false,
}) {
  @ApiProperty() @IsInt() @Min(1) version!: number;
}
export class CreateResourceInput {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(150) @Trimmed() name!: string;
  @ApiProperty({ enum: ['ROOM', 'WHOLE_PROPERTY'] }) @IsIn(['ROOM', 'WHOLE_PROPERTY']) kind!:
    | 'ROOM'
    | 'WHOLE_PROPERTY';
  @ApiProperty({ minimum: 1, maximum: 1000 }) @IsInt() @Min(1) @Max(1000) capacity!: number;
}
export class UpdateResourceInput {
  @ApiPropertyOptional()
  @OptionalValue()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  @Trimmed()
  name?: string;
  @ApiPropertyOptional({ minimum: 1, maximum: 1000 })
  @OptionalValue()
  @IsInt()
  @Min(1)
  @Max(1000)
  capacity?: number;
  @ApiProperty() @IsInt() @Min(1) version!: number;
}
export class OccupantView {
  @ApiProperty() contract_id!: string;
  @ApiProperty() tenant_id!: string;
  @ApiProperty() tenant_name!: string;
}
export class ResourceView {
  @ApiProperty() id!: string;
  @ApiProperty() property_id!: string;
  @ApiProperty() property_name!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ enum: ['ROOM', 'WHOLE_PROPERTY'] }) kind!: 'ROOM' | 'WHOLE_PROPERTY';
  @ApiProperty() capacity!: number;
  @ApiProperty() version!: number;
  @ApiProperty() current_count!: number;
  @ApiProperty() available_slots!: number;
  @ApiProperty() available!: boolean;
  @ApiProperty({ type: [OccupantView] }) occupants!: OccupantView[];
}
export class PropertyView {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() city!: string;
  @ApiProperty() address!: string;
  @ApiProperty() owner_user_id!: string;
  @ApiProperty() owner_name!: string;
  @ApiProperty({ enum: ['ROOMS', 'WHOLE_PROPERTY'] }) rental_mode!: 'ROOMS' | 'WHOLE_PROPERTY';
  @ApiProperty() version!: number;
  @ApiProperty({ type: [ResourceView] }) resources!: ResourceView[];
}
export class PropertyList extends PageView {
  @ApiProperty({ type: [PropertyView] }) items!: PropertyView[];
}
export class ResourceList extends PageView {
  @ApiProperty({ type: [ResourceView] }) items!: ResourceView[];
}

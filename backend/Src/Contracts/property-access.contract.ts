import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayUnique, ArrayMaxSize, MinLength } from 'class-validator';
import { VersionInput } from './common.contract';
export class GrantsInput extends VersionInput {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(1000)
  @IsString({ each: true })
  property_ids!: string[];
}
export class OwnerInput extends VersionInput {
  @ApiProperty() @IsString() @MinLength(1) owner_user_id!: string;
}
export class OwnershipView {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() owner_user_id!: string;
  @ApiProperty() version!: number;
}

import {
  IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DealType, PropertyCondition } from '../listing.entity';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty() @Type(() => Number) @IsNumber() price: number;
  @ApiProperty({ default: 'KZT' }) @IsString() @IsOptional() currency?: string;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() area?: number;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() rooms?: number;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() floor?: number;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() floorsTotal?: number;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() yearBuilt?: number;
  @ApiProperty({ enum: PropertyCondition, required: false }) @IsEnum(PropertyCondition) @IsOptional() condition?: PropertyCondition;
  @ApiProperty({ enum: DealType }) @IsEnum(DealType) dealType: DealType;
  @ApiProperty({ required: false }) @IsString() @IsOptional() address?: string;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() lat?: number;
  @ApiProperty({ required: false }) @Type(() => Number) @IsNumber() @IsOptional() lng?: number;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() isNewBuilding?: boolean;
  @ApiProperty({ required: false }) @IsString() @IsOptional() contactPhone?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() contactWhatsapp?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() contactTelegram?: string;
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() districtId?: string;
}

export class FilterListingsDto {
  @IsOptional() @IsString() cityId?: string;
  @IsOptional() @IsString() districtId?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsEnum(DealType) dealType?: DealType;
  @IsOptional() @Type(() => Number) @IsNumber() priceMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() priceMax?: number;
  @IsOptional() @Type(() => Number) @IsNumber() areaMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() areaMax?: number;
  @IsOptional() @Type(() => Number) @IsNumber() rooms?: number;
  @IsOptional() @IsBoolean() isNewBuilding?: boolean;
  @IsOptional() @IsBoolean() withPhotos?: boolean;
  @IsOptional() @IsString() q?: string;
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @IsOptional() @IsString() sort?: string; // price_asc, price_desc, date_desc
}

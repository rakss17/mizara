import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import {
    RecurringPaymentBillingCycle,
    RecurringPaymentType,
} from '@/common/enum';
import { IsDateStringWithOffset } from '@/common/validators/is-date-string-with-offset.validator';

export class CreateRecurringPaymentDto {
    @ApiProperty({ example: 'Netflix' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({
        example: RecurringPaymentType.Subscription,
        enum: RecurringPaymentType,
    })
    @IsNotEmpty()
    @IsEnum(RecurringPaymentType)
    type!: RecurringPaymentType;

    @ApiProperty({ example: 'Family plan subscription', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 15.99 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount!: number;

    @ApiProperty({ example: 'USD', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @ApiProperty({
        example: RecurringPaymentBillingCycle.Monthly,
        enum: RecurringPaymentBillingCycle,
    })
    @IsNotEmpty()
    @IsEnum(RecurringPaymentBillingCycle)
    billing_cycle!: RecurringPaymentBillingCycle;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    is_auto_renew!: boolean;

    @ApiProperty({ example: false })
    @IsNotEmpty()
    @IsBoolean()
    is_archived!: boolean;

    @ApiProperty({ example: false, required: false, default: false })
    @IsOptional()
    @IsBoolean()
    is_free_trial!: boolean;

    @ApiProperty({ example: 'netflix-icon', required: false })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({
        example: '2026-09-01T09:00:00+08:00',
        description:
            "ISO 8601 date-time with an explicit UTC offset (e.g. 'Z' or '+08:00'). Ambiguous local times without an offset are rejected.",
    })
    @IsNotEmpty()
    @IsDateStringWithOffset()
    due_date!: string;

    @ApiProperty({
        example: 'b3f2c1a0-1234-4a5b-9c6d-7e8f9a0b1c2d',
        required: false,
        description:
            'ID of a system default category or one of the user\'s own categories.',
    })
    @IsOptional()
    @IsUUID()
    category_id?: string;
}

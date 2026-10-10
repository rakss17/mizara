import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

import { IsDateStringWithOffset } from '@/common/validators/is-date-string-with-offset.validator';

export class ConfirmBillingCycleDto {
    @ApiProperty({
        example: '2026-10-05T09:00:00+08:00',
        required: false,
        description:
            "This cycle's billing date if it differs from the rolled-over one. ISO 8601 date-time with an explicit UTC offset.",
    })
    @IsOptional()
    @IsDateStringWithOffset()
    billing_date?: string;

    @ApiProperty({
        example: '2026-10-20T09:00:00+08:00',
        required: false,
        description:
            "This cycle's due date if it differs from the rolled-over one. ISO 8601 date-time with an explicit UTC offset.",
    })
    @IsOptional()
    @IsDateStringWithOffset()
    due_date?: string;

    @ApiProperty({
        example: 2450.75,
        required: false,
        description: "This cycle's amount if it differs from the previous one.",
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount?: number;
}

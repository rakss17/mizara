import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { Theme } from '@/common/enum';
import { IsIanaTimezone } from '@/common/validators/is-iana-timezone.validator';
import { IsIso4217Currency } from '@/common/validators/is-iso-4217-currency.validator';

export class UpdateUserSettingsDto {
    @ApiProperty({ example: 'PHP', required: false })
    @IsOptional()
    @IsIso4217Currency()
    currency?: string;

    @ApiProperty({ example: 'Asia/Manila', required: false })
    @IsOptional()
    @IsIanaTimezone()
    timezone?: string;

    @ApiProperty({ example: Theme.Light, enum: Theme, required: false })
    @IsOptional()
    @IsEnum(Theme)
    theme?: Theme;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    push_notifications_enabled?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    email_notifications_enabled?: boolean;
}

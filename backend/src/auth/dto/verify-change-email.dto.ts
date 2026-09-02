import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class VerifyChangeEmailDto {
    @ApiProperty({
        example: '482913',
    })
    @IsNotEmpty()
    @Matches(/^\d{6}$/, {
        message: 'Code must be exactly 6 digits',
    })
    code!: string;
}

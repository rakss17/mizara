import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ example: 'a1b2c3...' })
    @IsNotEmpty()
    refresh_token!: string;
}

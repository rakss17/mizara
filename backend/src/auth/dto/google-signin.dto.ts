import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSigninDto {
    @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIs...' })
    @IsString()
    @IsNotEmpty()
    id_token!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserProfileDto {
    @ApiProperty({ example: 'John', required: false })
    @IsOptional()
    first_name?: string;

    @ApiProperty({ example: 'Doe', required: false })
    @IsOptional()
    last_name?: string;
}

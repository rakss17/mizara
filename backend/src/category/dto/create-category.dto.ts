import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Gym Membership' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiProperty({ example: 'health-fitness', required: false })
    @IsOptional()
    @IsString()
    icon?: string;
}

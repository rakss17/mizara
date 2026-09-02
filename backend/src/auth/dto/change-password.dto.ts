import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'CurrentP@ssw0rd!' })
    @IsNotEmpty()
    @IsString()
    current_password!: string;

    @ApiProperty({ example: 'NewP@ssw0rd!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'new_password must be at least 8 characters long',
    })
    @Matches(/\d/, {
        message: 'new_password must contain at least 1 number',
    })
    @Matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/, {
        message: 'new_password must contain at least 1 special character',
    })
    new_password!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
    @ApiProperty({
        example: 'newemail@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    new_email!: string;

    @ApiProperty({ example: 'CurrentP@ssw0rd!' })
    @IsNotEmpty()
    password!: string;
}

import {
    Controller,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    async findMe(@CurrentUser() user: AuthenticatedUser) {
        return this.userService.findMe(user.id, user.email);
    }
}

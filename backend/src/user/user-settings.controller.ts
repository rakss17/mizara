import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserSettingsService } from '@/user/user-settings.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserSettingsDto } from '@/user/dto/update-user-settings.dto';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@ApiTags('User Settings')
@ApiBearerAuth()
@Controller('/api/user/me/settings')
export class UserSettingsController {
    constructor(private readonly userSettingsService: UserSettingsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async findOne(@CurrentUser() user: AuthenticatedUser) {
        return this.userSettingsService.findOne(user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(HttpStatus.OK)
    async update(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: UpdateUserSettingsDto,
    ) {
        return this.userSettingsService.update(dto, user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('options')
    @HttpCode(HttpStatus.OK)
    findOptions() {
        return this.userSettingsService.getOptions();
    }
}

import {
    Controller,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('/api/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getOverview(@CurrentUser() user: AuthenticatedUser) {
        return this.dashboardService.getOverview(user.id, user.email);
    }
}

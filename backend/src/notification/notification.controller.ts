import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { NotificationService } from '@/notification/notification.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { FindAllNotificationDto } from './dto/find-all-notification.dto';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('/api/notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: FindAllNotificationDto,
    ) {
        return this.notificationService.findAll(user.id, user.email, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('unread-count')
    @HttpCode(HttpStatus.OK)
    async getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
        return this.notificationService.getUnreadCount(user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('read-all')
    @HttpCode(HttpStatus.OK)
    async markAllAsRead(@CurrentUser() user: AuthenticatedUser) {
        return this.notificationService.markAllAsRead(user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    @HttpCode(HttpStatus.OK)
    async markAsRead(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.notificationService.markAsRead(id, user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.notificationService.remove(id, user.id, user.email);
    }
}

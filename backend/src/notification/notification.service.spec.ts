import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { NotificationModel } from './models/notification.model';

describe('NotificationService', () => {
    let service: NotificationService;
    const notificationModel = {
        create: jest.fn(),
        findAndCountAll: jest.fn(),
        findOne: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: getModelToken(NotificationModel),
                    useValue: notificationModel,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('scopes markAsRead to the current user', async () => {
        notificationModel.findOne.mockResolvedValue(null);

        await expect(
            service.markAsRead('notification-id', 'user-id', 'a@b.com'),
        ).rejects.toThrow(NotFoundException);
        expect(notificationModel.findOne).toHaveBeenCalledWith({
            where: { id: 'notification-id', user_id: 'user-id' },
        });
    });

    it('keeps the first read time when already read', async () => {
        const notification = {
            read_at: new Date('2026-10-01'),
            update: jest.fn(),
        };
        notificationModel.findOne.mockResolvedValue(notification);

        await service.markAsRead('notification-id', 'user-id', 'a@b.com');

        expect(notification.update).not.toHaveBeenCalled();
    });

    it('only marks unread notifications in markAllAsRead', async () => {
        notificationModel.update.mockResolvedValue([3]);

        const result = await service.markAllAsRead('user-id', 'a@b.com');

        const [values, options] = notificationModel.update.mock.calls[0] as [
            { read_at: Date },
            unknown,
        ];
        expect(values.read_at).toBeInstanceOf(Date);
        expect(options).toEqual({
            where: { user_id: 'user-id', read_at: null },
        });
        expect(result.data).toEqual({ updated_count: 3 });
    });
});

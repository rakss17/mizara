import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';

import { UserSettingsModel } from '@/user/models/user-settings.model';
import { UpdateUserSettingsDto } from '@/user/dto/update-user-settings.dto';
import { Theme } from '@/common/enum';
import { COMMON_CURRENCIES } from '@/user/constants/common-currencies';
import { COMMON_TIMEZONES } from '@/user/constants/common-timezones';

const CURRENCY_DISPLAY_NAMES = new Intl.DisplayNames(['en'], {
    type: 'currency',
});

export interface KeyedOption {
    key: string;
    name: string;
}

@Injectable()
export class UserSettingsService {
    private readonly logger = new Logger(UserSettingsService.name);

    constructor(
        @InjectModel(UserSettingsModel)
        private userSettingsModel: typeof UserSettingsModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    private async findOrCreate(userId: string, transaction?: Transaction) {
        const [settings] = await this.userSettingsModel.findOrCreate({
            where: { user_id: userId },
            defaults: { user_id: userId },
            transaction,
        });

        return settings;
    }

    async findOne(currentUserId: string, currentUserEmail: string) {
        this.logger.log(`Fetching user settings for user: ${currentUserEmail}`);

        const settings = await this.findOrCreate(currentUserId);

        this.logger.log(
            `Successfully fetched user settings for user: ${currentUserEmail}`,
        );

        return {
            message: 'Fetched user settings successfully',
            data: this.toSettingsResponse(settings),
        };
    }

    async update(
        dto: UpdateUserSettingsDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Updating user settings for user: ${currentUserEmail}`,
            );

            const settings = await this.findOrCreate(
                currentUserId,
                transaction,
            );

            await settings.update(
                {
                    ...(dto.currency !== undefined && {
                        currency: dto.currency,
                    }),
                    ...(dto.timezone !== undefined && {
                        timezone: dto.timezone,
                    }),
                    ...(dto.theme !== undefined && { theme: dto.theme }),
                    ...(dto.push_notifications_enabled !== undefined && {
                        push_notifications_enabled:
                            dto.push_notifications_enabled,
                    }),
                    ...(dto.email_notifications_enabled !== undefined && {
                        email_notifications_enabled:
                            dto.email_notifications_enabled,
                    }),
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully updated user settings for user: ${currentUserEmail}`,
            );

            return {
                message: 'Successfully updated user settings',
                data: this.toSettingsResponse(settings),
            };
        } catch (error) {
            await transaction.rollback();

            this.logger.error(
                `Error updating user settings for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    getOptions() {
        return {
            message: 'Fetched user settings options successfully',
            data: {
                currencies: COMMON_CURRENCIES.map((currency) =>
                    this.formatCurrencyOption(currency),
                ),
                timezones: COMMON_TIMEZONES.map(({ key }) =>
                    this.buildTimezoneOption(key),
                )
                    .sort(
                        (a, b) =>
                            a.minutes - b.minutes ||
                            a.name.localeCompare(b.name),
                    )
                    .map(({ key, name }) => ({ key, name })),
                themes: Object.values(Theme).map((theme) =>
                    this.formatThemeOption(theme),
                ),
            },
        };
    }

    // Parses the "GMT+08:00" part Intl produces into total minutes so
    // timezone options can be sorted earliest-to-latest, the way most
    // timezone pickers order theirs.
    private resolveTimezoneOffset(timezone: string): {
        minutes: number;
        display: string | undefined;
    } {
        const display = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'longOffset',
        })
            .formatToParts(new Date())
            .find((part) => part.type === 'timeZoneName')?.value;

        const match = display?.match(/GMT([+-])(\d{2}):(\d{2})/);
        const minutes = match
            ? (match[1] === '-' ? -1 : 1) *
              (Number(match[2]) * 60 + Number(match[3]))
            : 0;

        return { minutes, display };
    }

    private buildTimezoneOption(timezone: string): KeyedOption & {
        minutes: number;
    } {
        // Common timezones carry a hand-curated label (see
        // common-timezones.ts); a timezone outside that list - stored via
        // a value the update DTO otherwise accepts - falls back to the
        // last path segment of its IANA id.
        const curatedLabel = COMMON_TIMEZONES.find(
            (candidate) => candidate.key === timezone,
        )?.label;
        const label =
            curatedLabel ?? timezone.split('/').pop()!.replace(/_/g, ' ');
        const { minutes, display } = this.resolveTimezoneOffset(timezone);

        return {
            key: timezone,
            name: display ? `${label} (${display})` : label,
            minutes,
        };
    }

    private formatTimezoneOption(timezone: string): KeyedOption {
        const { key, name } = this.buildTimezoneOption(timezone);
        return { key, name };
    }

    private formatCurrencyOption(code: string): KeyedOption {
        return { key: code, name: CURRENCY_DISPLAY_NAMES.of(code) ?? code };
    }

    private formatThemeOption(theme: Theme): KeyedOption {
        return {
            key: theme,
            name: theme.charAt(0).toUpperCase() + theme.slice(1),
        };
    }

    private toSettingsResponse(settings: UserSettingsModel) {
        return {
            id: settings.id,
            user_id: settings.user_id,
            currency: this.formatCurrencyOption(settings.currency),
            timezone: this.formatTimezoneOption(settings.timezone),
            theme: this.formatThemeOption(settings.theme),
            push_notifications_enabled: settings.push_notifications_enabled,
            email_notifications_enabled: settings.email_notifications_enabled,
            created_at: settings.created_at,
            updated_at: settings.updated_at,
        };
    }
}

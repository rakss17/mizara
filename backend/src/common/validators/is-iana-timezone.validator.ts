import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export const IANA_TIMEZONES = Intl.supportedValuesOf('timeZone');
const VALID_TIMEZONES = new Set(IANA_TIMEZONES);

export function IsIanaTimezone(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isIanaTimezone',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    return (
                        typeof value === 'string' && VALID_TIMEZONES.has(value)
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid IANA timezone (e.g. Asia/Manila)`;
                },
            },
        });
    };
}

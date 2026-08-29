import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export const ISO_4217_CURRENCIES = Intl.supportedValuesOf('currency');
const VALID_CURRENCIES = new Set(ISO_4217_CURRENCIES);

export function IsIso4217Currency(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isIso4217Currency',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    return (
                        typeof value === 'string' && VALID_CURRENCIES.has(value)
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ISO 4217 currency code (e.g. PHP)`;
                },
            },
        });
    };
}

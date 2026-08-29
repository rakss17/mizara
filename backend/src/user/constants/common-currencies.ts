import { ISO_4217_CURRENCIES } from '@/common/validators/is-iso-4217-currency.validator';

// Curated subset of ISO_4217_CURRENCIES shown to users as dropdown options.
// Validation still accepts any code Intl recognizes - see
// IsIso4217Currency - this list is presentation-only.
export const COMMON_CURRENCIES = [
    'PHP',
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CNY',
    'KRW',
    'SGD',
    'HKD',
    'AUD',
    'CAD',
    'CHF',
    'NZD',
    'INR',
    'THB',
    'MYR',
    'IDR',
    'VND',
    'AED',
    'SAR',
];

const unrecognized = COMMON_CURRENCIES.filter(
    (currency) => !ISO_4217_CURRENCIES.includes(currency),
);
if (unrecognized.length > 0) {
    throw new Error(
        `COMMON_CURRENCIES contains codes the runtime's Intl data doesn't recognize: ${unrecognized.join(', ')}`,
    );
}

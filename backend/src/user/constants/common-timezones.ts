import { IANA_TIMEZONES } from '@/common/validators/is-iana-timezone.validator';

// Curated subset of IANA_TIMEZONES shown to users as dropdown options.
// Validation still accepts any zone Intl recognizes - see
// IsIanaTimezone - this list is presentation-only.
//
// label is curated by hand rather than derived from the zone id: Node's
// bundled ICU data treats 'Asia/Calcutta' as canonical (not the newer
// 'Asia/Kolkata' alias), and a path-derived label would surface that
// outdated name to users instead of "Kolkata".
export const COMMON_TIMEZONES = [
    { key: 'Asia/Manila', label: 'Manila' },
    { key: 'Asia/Singapore', label: 'Singapore' },
    { key: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { key: 'Asia/Shanghai', label: 'Shanghai' },
    { key: 'Asia/Tokyo', label: 'Tokyo' },
    { key: 'Asia/Seoul', label: 'Seoul' },
    { key: 'Asia/Bangkok', label: 'Bangkok' },
    { key: 'Asia/Jakarta', label: 'Jakarta' },
    { key: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur' },
    { key: 'Asia/Calcutta', label: 'Kolkata' },
    { key: 'Asia/Dubai', label: 'Dubai' },
    { key: 'Asia/Riyadh', label: 'Riyadh' },
    { key: 'Europe/London', label: 'London' },
    { key: 'Europe/Paris', label: 'Paris' },
    { key: 'Europe/Berlin', label: 'Berlin' },
    { key: 'Europe/Moscow', label: 'Moscow' },
    { key: 'Africa/Cairo', label: 'Cairo' },
    { key: 'Africa/Johannesburg', label: 'Johannesburg' },
    { key: 'America/New_York', label: 'New York' },
    { key: 'America/Chicago', label: 'Chicago' },
    { key: 'America/Denver', label: 'Denver' },
    { key: 'America/Los_Angeles', label: 'Los Angeles' },
    { key: 'America/Sao_Paulo', label: 'Sao Paulo' },
    { key: 'Australia/Sydney', label: 'Sydney' },
    { key: 'Pacific/Auckland', label: 'Auckland' },
];

const unrecognized = COMMON_TIMEZONES.filter(
    (timezone) => !IANA_TIMEZONES.includes(timezone.key),
);
if (unrecognized.length > 0) {
    throw new Error(
        `COMMON_TIMEZONES contains zones the runtime's Intl data doesn't recognize: ${unrecognized
            .map((timezone) => timezone.key)
            .join(', ')}`,
    );
}

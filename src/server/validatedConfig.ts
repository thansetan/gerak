import parse from 'parse-duration';
import { APP_CONFIG } from '~/shared/config';

function requiredDuration(value: string, field: string): number {
    const sec = parse(value, 's');
    if (sec == null || sec <= 0)
        throw new Error(
            `Invalid APP_CONFIG.${field}: "${value}" — expected duration like "1h", "7d", "1y"`
        );

    return sec;
}
export const getValidatedConfig = () => ({
    activityFetchDuration: requiredDuration(
        APP_CONFIG.activityFetchDuration,
        'activityFetchDuration'
    ),
    activityCacheTTL: requiredDuration(
        APP_CONFIG.activityCacheTTL,
        'activityCacheTTL'
    ),
    gearCacheTTL: requiredDuration(APP_CONFIG.gearCacheTTL, 'gearCacheTTL'),
    tokenCacheTTL: requiredDuration(APP_CONFIG.tokenCacheTTL, 'tokenCacheTTL'),
});

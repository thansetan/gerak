import { createServerFn } from '@tanstack/react-start';
import { APP_CONFIG } from '../shared/config';
import type { ActivitiesResponse, StravaActivity } from '../shared/types';
import { getAccessToken } from './auth';
import { getFromCache, setToCache } from './cache';
import { getValidatedConfig } from './validatedConfig';

export const ACTIVITIES_CACHE_KEY = `strava:activities:${APP_CONFIG.maxFetchedActivities}:${APP_CONFIG.activityCacheTTL}`;

export const getActivities = createServerFn().handler(async () => {
    const cached = await getFromCache<ActivitiesResponse>(ACTIVITIES_CACHE_KEY);
    if (cached) return cached;
    return fetchActivitiesFromStrava();
});

async function fetchActivitiesFromStrava(): Promise<ActivitiesResponse> {
    const token = await getAccessToken();
    const now = Math.floor(Date.now() / 1000);
    const validatedConfig = getValidatedConfig();
    const since = now - validatedConfig.activityFetchDuration;

    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${APP_CONFIG.maxFetchedActivities}&after=${since}&before=${now}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.status === 401) {
        const freshToken = await getAccessToken();
        console.log(freshToken);
        const retryResponse = await fetch(
            `https://www.strava.com/api/v3/athlete/activities?per_page=${APP_CONFIG.maxFetchedActivities}&after=${since}&before=${now}`,
            { headers: { Authorization: `Bearer ${freshToken}` } }
        );
        if (!retryResponse.ok) {
            return handleApiError(retryResponse);
        }
        const retryData = (await retryResponse.json()) as StravaActivity[];
        return buildResponse(
            retryData,
            since,
            now,
            validatedConfig.activityCacheTTL
        );
    }

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = (await response.json()) as StravaActivity[];
    return buildResponse(data, since, now, validatedConfig.activityCacheTTL);
}

function buildResponse(
    activities: StravaActivity[],
    windowStartEpoch: number,
    windowEndEpoch: number,
    activityCacheTTL: number
): ActivitiesResponse {
    const result: ActivitiesResponse = {
        activities,
        syncedAt: new Date().toISOString(),
        fetchWindowStart: new Date(windowStartEpoch * 1000).toISOString(),
        fetchWindowEnd: new Date(windowEndEpoch * 1000).toISOString(),
    };
    setToCache(ACTIVITIES_CACHE_KEY, result, activityCacheTTL);

    return result;
}

function handleApiError(response: Response): never {
    if (response.status >= 500) {
        throw new Error(
            'Strava API is currently unavailable. Please try again later.'
        );
    }
    if (response.status === 401) {
        throw new Error(
            'Authentication with Strava failed. Token refresh unsuccessful.'
        );
    }
    throw new Error(
        `Strava API error: ${response.status} ${response.statusText}`
    );
}

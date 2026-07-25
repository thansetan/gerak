import { createServerFn } from '@tanstack/react-start';
import { getAccessToken } from './auth';
import { getFromCache, setToCache } from './cache';
import type { ActivitiesResponse, StravaActivity } from './types';
import { APP_CONFIG } from './config';

const FETCH_WINDOW = '1year';
export const ACTIVITIES_CACHE_KEY = `strava:activities:${APP_CONFIG.maxFetchedActivities}:${FETCH_WINDOW}`;
const ACTIVITIES_TTL = 3600;

export const getActivities = createServerFn().handler(async () => {
    const cached = await getFromCache<ActivitiesResponse>(ACTIVITIES_CACHE_KEY);
    if (cached) return cached;
    return fetchActivitiesFromStrava();
});

async function fetchActivitiesFromStrava(): Promise<ActivitiesResponse> {
    const token = await getAccessToken();
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;

    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${APP_CONFIG.maxFetchedActivities}&after=${oneYearAgo}&before=${now}`,
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
            `https://www.strava.com/api/v3/athlete/activities?per_page=${APP_CONFIG.maxFetchedActivities}&after=${oneYearAgo}&before=${now}`,
            { headers: { Authorization: `Bearer ${freshToken}` } }
        );
        if (!retryResponse.ok) {
            return handleApiError(retryResponse);
        }
        const retryData = (await retryResponse.json()) as StravaActivity[];
        return buildResponse(retryData, oneYearAgo, now);
    }

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = (await response.json()) as StravaActivity[];
    return buildResponse(data, oneYearAgo, now);
}

function buildResponse(activities: StravaActivity[], windowStartEpoch: number, windowEndEpoch: number): ActivitiesResponse {
    const result: ActivitiesResponse = {
        activities,
        syncedAt: new Date().toISOString(),
        fetchWindowStart: new Date(windowStartEpoch * 1000).toISOString(),
        fetchWindowEnd: new Date(windowEndEpoch * 1000).toISOString(),
    };
    setToCache(ACTIVITIES_CACHE_KEY, result, ACTIVITIES_TTL);
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

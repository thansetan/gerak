import { createServerFn } from '@tanstack/react-start';
import { getAccessToken } from './auth';
import { getFromCache, setToCache } from './cache';
import type { ActivitiesResponse, StravaActivity } from './types';
import { MAX_FETCHED_ACTIVITIES } from './config';

const ACTIVITIES_CACHE_KEY = 'strava:activities:200';
const ACTIVITIES_TTL = 3600;

export const getActivities = createServerFn().handler(async () => {
    const cached = await getFromCache<ActivitiesResponse>(ACTIVITIES_CACHE_KEY);
    if (cached) return cached;
    return fetchActivitiesFromStrava();
});

async function fetchActivitiesFromStrava(): Promise<ActivitiesResponse> {
    const token = await getAccessToken();

    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${MAX_FETCHED_ACTIVITIES}`,
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
            'https://www.strava.com/api/v3/athlete/activities?per_page=200',
            { headers: { Authorization: `Bearer ${freshToken}` } }
        );
        if (!retryResponse.ok) {
            return handleApiError(retryResponse);
        }
        const retryData = (await retryResponse.json()) as StravaActivity[];
        return buildResponse(retryData);
    }

    if (!response.ok) {
        return handleApiError(response);
    }

    const data = (await response.json()) as StravaActivity[];
    return buildResponse(data);
}

function buildResponse(activities: StravaActivity[]): ActivitiesResponse {
    const result: ActivitiesResponse = {
        activities,
        syncedAt: new Date().toISOString(),
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

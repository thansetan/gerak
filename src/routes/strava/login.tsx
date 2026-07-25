import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/strava/login')({
    beforeLoad: async () => {
        const stravaRefreshToken = process.env.STRAVA_REFRESH_TOKEN;
        if (stravaRefreshToken) {
            throw redirect({
                to: '/',
            });
        }
        throw redirect({
            href: `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&response_type=code&scope=activity:read_all,profile:read_all`,
        });
    },
});

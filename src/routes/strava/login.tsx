import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthenticated, getStravaAuthUrl } from '../../server/stravaAuth';

export const Route = createFileRoute('/strava/login')({
    beforeLoad: async () => {
        const authenticated = await isAuthenticated()
        if (authenticated) {
            throw redirect({
                to: '/',
            });
        }
        const authUrl = await getStravaAuthUrl()
        throw redirect({
            href: authUrl,
        });
    },
});

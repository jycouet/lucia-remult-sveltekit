import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AUTH_ROUTES } from '$auth/AUTH_ROUTES';
import { remult } from 'remult';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!remult.user) {
		throw redirect(302, AUTH_ROUTES.login({ redirect: url.pathname }));
	}

	if (!remult.user.email_verified) {
		throw redirect(302, AUTH_ROUTES.email_verification());
	}

	return { user: remult.user };
};

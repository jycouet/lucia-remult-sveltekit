import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AUTH_ROUTES } from '../auth/AUTH_ROUTES';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// TODO Switch to remult.user!
	const session = await locals.auth.validate();

	if (!session) throw redirect(302, AUTH_ROUTES.login({ redirect: url.pathname }));
	if (!session.user.emailVerified) {
		throw redirect(302, '/email-verification');
	}
	return {
		userId: session.user.userId,
		email: session.user.email
	};
};

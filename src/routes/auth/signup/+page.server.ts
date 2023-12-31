import { auth } from '$auth/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { generateEmailVerificationToken } from '$auth/server/token';
import { isValidEmail, sendEmailVerificationLink } from '$auth/server/email';

import type { PageServerLoad, Actions } from './$types';
import { AUTH_ROUTES } from '$auth/AUTH_ROUTES';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.emailVerified) throw redirect(302, AUTH_ROUTES.email_verification());
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		// basic check
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email', // auth method
					providerUserId: email.toLowerCase(), // unique id when using "email" auth method
					password // hashed by Lucia
				},
				attributes: {
					email: email.toLowerCase(),
					email_verified: false
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {
					roles: ['R1']
				}
			});
			locals.auth.setSession(session); // set session cookie
			const token = await generateEmailVerificationToken(user.userId);
			await sendEmailVerificationLink(token);
		} catch (e) {
			// check for unique constraint error in user table
			// if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			// 	return fail(400, {
			// 		message: 'Account already exists'
			// 	});
			// }
			console.log(`e`, e);

			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, AUTH_ROUTES.email_verification());
	}
};

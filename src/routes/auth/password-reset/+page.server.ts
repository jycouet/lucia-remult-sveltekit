import { isValidEmail, sendPasswordResetLink } from '$auth/server/email';
import { auth } from '$auth/server/lucia';
import { generatePasswordResetToken } from '$auth/server/token';
import { fail } from '@sveltejs/kit';

import { remult } from 'remult';
import { AuthUser } from '../shared/AuthUser';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		// basic check
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		try {
			const repo = remult.repo(AuthUser);
			const storedUser = await repo.findFirst({ email: email });
			if (!storedUser) {
				return fail(400, {
					message: 'User does not exist'
				});
			}
			const user = auth.transformDatabaseUser(storedUser);
			const token = await generatePasswordResetToken(user.userId);
			await sendPasswordResetLink(token);
			return {
				success: true
			};
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};

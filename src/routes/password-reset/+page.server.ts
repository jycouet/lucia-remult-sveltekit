import { isValidEmail, sendPasswordResetLink } from '$lib/server/email';
import { auth } from '$lib/server/lucia';
import { generatePasswordResetToken } from '$lib/server/token';
import { fail } from '@sveltejs/kit';

import { remult } from 'remult';
import { User } from '../../shared/User';
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
			const repo = remult.repo(User);
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

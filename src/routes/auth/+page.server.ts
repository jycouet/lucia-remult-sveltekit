import { auth } from '$auth/server/lucia';
import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		return { success: true };
		// throw redirect(302, '/login'); // redirect to login page
	}
};

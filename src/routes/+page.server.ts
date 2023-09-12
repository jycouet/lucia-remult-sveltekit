import { remult } from 'remult';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	if (remult.user) {
		throw redirect(302, '/app');
	}
	return {};
}) satisfies PageServerLoad;

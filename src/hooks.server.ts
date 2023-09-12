import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createPostgresConnection } from 'remult/postgres';
import { remultSveltekit } from 'remult/remult-sveltekit';
import { EmailVerificationToken } from './shared/EmailVerificationToken';
import { PasswordResetToken } from './shared/PasswordResetToken';
import { UsersController } from './shared/UsersController';

import { User } from './shared/User';
import { UserKey } from './shared/UserKey';
import { UserSession } from './shared/UserSession';
import { SqlDatabase, remult } from 'remult';

const handleAuth: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

SqlDatabase.LogToConsole = 'oneLiner';

export const remultApi = remultSveltekit({
	logApiEndPoints: true,
	ensureSchema: false,
	entities: [User, EmailVerificationToken, UserSession, UserKey, PasswordResetToken],
	controllers: [UsersController],
	initRequest: async (request, options) => {
		const session = await request.locals.auth.validate();
		if (session?.user) {
			remult.user = { id: session?.user.userId, name: session?.user.email };
		} else {
			remult.user = undefined;
		}
	},
	dataProvider: createPostgresConnection({
		connectionString: 'postgres://postgres:example@127.0.0.1:5433/lucia-demo'
	})
});

export const handle = sequence(
	//
	handleAuth,
	remultApi
);

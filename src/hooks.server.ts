import { auth } from '$auth/server/lucia';
import { AuthPasswordResetToken } from '$auth/shared/AuthPasswordResetToken';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createPostgresConnection } from 'remult/postgres';
import { remultSveltekit } from 'remult/remult-sveltekit';
import { AuthEmailVerificationToken } from './routes/auth/shared/AuthEmailVerificationToken';
import { UsersController } from './shared/UsersController';

import { AuthUserKey } from '$auth/shared/AuthUserKey';
import { AuthUserSession } from '$auth/shared/AuthUserSession';
import { SqlDatabase, remult } from 'remult';
import { AuthUser } from './routes/auth/shared/AuthUser';
import { RemultMigration, migrationUp } from './shared/RemultMigration';

const handleAuth: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

SqlDatabase.LogToConsole = 'oneLiner';

export const remultApi = remultSveltekit({
	logApiEndPoints: false,
	ensureSchema: false,
	entities: [
		AuthUser,
		AuthEmailVerificationToken,
		AuthUserSession,
		AuthUserKey,
		AuthPasswordResetToken,
		RemultMigration
	],
	controllers: [UsersController],
	initRequest: async (request, options) => {
		const session = await request.locals.auth.validate();

		if (session?.user) {
			remult.user = {
				id: session?.user.userId,
				name: session?.user.email,
				email: session?.user.email,
				email_verified: session?.user.emailVerified,
				roles: session?.roles
			};
		} else {
			remult.user = undefined;
		}
	},
	dataProvider: createPostgresConnection({
		connectionString: 'postgres://postgres:example@127.0.0.1:5433/lucia-demo'
		// connectionString: 'postgres://postgres:example@127.0.0.1:5433/my-minion-cadb'
	}),
	initApi(remult) {
		migrationUp();
	}
});

export const handle = sequence(
	//
	handleAuth,
	remultApi
);

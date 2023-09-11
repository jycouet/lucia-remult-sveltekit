import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import postgres from 'pg';

const pool = new postgres.Pool({
	connectionString: 'postgres://postgres:example@127.0.0.1:5433/lucia-demo'
});

export const auth = lucia({
	adapter: pg(pool, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			email: data.email,
			emailVerified: Boolean(data.email_verified)
		};
	}
});

export type Auth = typeof auth;

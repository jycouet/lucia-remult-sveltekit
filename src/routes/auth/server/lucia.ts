import { dev } from '$app/environment';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { remultAdapter } from './remultAdapter';

export const auth = lucia({
	adapter: remultAdapter(),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			email: data.email,
			emailVerified: Boolean(data.email_verified)
		};
	},
	getSessionAttributes: (data) => {
		return {
			roles: data.roles
		};
	}
});

export type Auth = typeof auth;

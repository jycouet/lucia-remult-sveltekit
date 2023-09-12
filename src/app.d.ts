// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$auth/server/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: number;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};

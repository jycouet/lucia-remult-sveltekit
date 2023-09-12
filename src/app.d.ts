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
			email_verified: boolean;
		};
		type DatabaseSessionAttributes = {
			roles: string[];
		};
	}
}

declare module 'remult' {
	export interface UserInfo {
		email: string;
		email_verified: boolean;
	}
}

export {};

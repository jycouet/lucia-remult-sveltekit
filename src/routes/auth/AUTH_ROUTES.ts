export const AUTH_ROUTES = {
	base: () => '/auth',
	login: (obj?: { redirect?: string; email?: string; focus?: string }) =>
		`${AUTH_ROUTES.base()}/login?redirect=${obj?.redirect ?? '/app'}` +
		`${obj?.email ? `&email=${obj?.email}` : ''}` +
		`${obj?.focus ? `&focus=${obj?.focus}` : ''}`,
	logout: () => `${AUTH_ROUTES.base()}?/logout`,
	signup: () => `${AUTH_ROUTES.base()}/signup`,
	password_reset: (email?: string) =>
		`${AUTH_ROUTES.base()}/password-reset${email ? `?email=${email}` : ''}`,
	email_verification: () => `${AUTH_ROUTES.base()}/email-verification`
	// set_password: (token: string) => `${AUTH_ROUTES.base()}/set-password?token=${token}`
};

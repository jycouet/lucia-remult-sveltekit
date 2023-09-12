export const AUTH_ROUTES = {
	base: () => '/auth',
	login: (obj?: { redirect?: string; email?: string; focus?: string }) =>
		`${AUTH_ROUTES.base()}/login?redirect=${obj?.redirect ?? '/app'}` +
		`${obj?.email ? `&email=${obj?.email}` : ''}` +
		`${obj?.focus ? `&focus=${obj?.focus}` : ''}`
	// logout: () => `${AUTH_ROUTES.base()}/logout`,
	// ask_reset_password: (email?: string) =>
	// 	`${AUTH_ROUTES.base()}/ask-reset-password${email ? `?email=${email}` : ''}`,
	// set_password: (token: string) => `${AUTH_ROUTES.base()}/set-password?token=${token}`
};

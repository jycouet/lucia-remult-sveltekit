import { AuthUserKey } from '$auth/shared/AuthUserKey';
import { AuthUserSession } from '$auth/shared/AuthUserSession';
import type { Adapter, InitializeAdapter, SessionSchema } from 'lucia';
import { remult } from 'remult';
import { AuthUser } from '../shared/AuthUser';

type PossibleRemultError = {
	code: string;
	message: string;
};

export const remultAdapter = (): InitializeAdapter<Adapter> => {
	const repo_User = remult.repo(AuthUser);
	const repo_Session = remult.repo(AuthUserSession);
	const repo_UserKey = remult.repo(AuthUserKey);

	return (LuciaError) => {
		return {
			getUser: async (userId) => {
				return await repo_User.findFirst({
					id: userId
				});
			},
			setUser: async (user, key) => {
				if (!key) {
					await repo_User.insert({
						id: user.id,
						email: user.email,
						email_verified: user.email_verified
					});
					return;
				}
				try {
					await remult.dataProvider.transaction(async () => {
						await repo_User.insert({
							id: user.id,
							email: user.email,
							email_verified: user.email_verified
						});
						await repo_UserKey.insert({
							id: key.id,
							user_id: key.user_id,
							hashed_password: key.hashed_password!
						});
					});
				} catch (e) {
					const error = e as Partial<PossibleRemultError>;
					// TODO
					if (error.code === 'P2002' && error.message?.includes('`id`'))
						throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
					throw error;
				}
			},
			deleteUser: async (userId) => {
				try {
					await repo_User.delete({
						id: userId
					});
				} catch (e) {
					// TODO
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2025') {
						// user does not exist
						return;
					}
					throw e;
				}
			},
			updateUser: async (userId, partialUser) => {
				await repo_User.update(userId, partialUser);
			},
			getSession: async (sessionId) => {
				const result = await repo_Session.findFirst({
					id: sessionId
				});
				if (!result) return null;
				return transformSession(result);
			},
			getSessionsByUserId: async (userId) => {
				const sessions = await repo_Session.find({
					where: {
						user_id: userId
					}
				});
				return sessions.map((session) => transformSession(session));
			},
			setSession: async (session) => {
				try {
					const { roles, ...rest } = session;
					await repo_Session.insert({
						...rest,
						roles: (roles ?? []).join(',')
					});
				} catch (e) {
					// TODO
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2003') {
						throw new LuciaError('AUTH_INVALID_USER_ID');
					}

					throw error;
				}
			},
			deleteSession: async (sessionId) => {
				try {
					await repo_Session.delete(sessionId);
				} catch (e) {
					// TODO
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2025') {
						// session does not exist
						return;
					}
					throw e;
				}
			},
			deleteSessionsByUserId: async (userId) => {
				const all = await repo_Session.find({ where: { user_id: userId } });
				for (const session of all) {
					await repo_Session.delete(session.id);
				}
			},
			updateSession: async (userId, partialSession) => {
				const { roles, ...rest } = partialSession;
				await repo_Session.update(userId, {
					...rest,
					roles: (roles ?? []).join(',')
				});
			},

			getKey: async (keyId) => {
				return await repo_UserKey.findFirst({
					id: keyId
				});
			},
			getKeysByUserId: async (userId) => {
				return await repo_UserKey.find({
					where: {
						user_id: userId
					}
				});
			},

			setKey: async (key) => {
				try {
					await repo_UserKey.insert({
						id: key.id,
						user_id: key.user_id,
						hashed_password: key.hashed_password!
					});
				} catch (e) {
					// TODO
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2003') {
						throw new LuciaError('AUTH_INVALID_USER_ID');
					}
					if (error.code === 'P2002' && error.message?.includes('`id`')) {
						throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
					}
					throw error;
				}
			},
			deleteKey: async (keyId) => {
				try {
					await repo_UserKey.delete(keyId);
				} catch (e) {
					// TODO
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2025') {
						// key does not exist
						return;
					}
					throw e;
				}
			},
			deleteKeysByUserId: async (userId) => {
				const all = await repo_UserKey.find({ where: { user_id: userId } });
				for (const key of all) {
					await repo_UserKey.delete(key.id);
				}
			},
			updateKey: async (userId, partialKey) => {
				await repo_UserKey.update(userId, {
					id: partialKey.id,
					user_id: partialKey.user_id,
					hashed_password: partialKey.hashed_password!
				});
			}
		};
	};
};

export const transformSession = (sessionData: AuthUserSession): SessionSchema => {
	return {
		id: sessionData.id,
		user_id: sessionData.user_id,
		active_expires: sessionData.active_expires,
		idle_expires: sessionData.idle_expires,
		roles: sessionData.roles ? sessionData.roles.split(',') : []
	};
};

export type RemultSession = Omit<SessionSchema, 'active_expires' | 'idle_expires'> & {
	active_expires: BigInt | number;
	idle_expires: BigInt | number;
};

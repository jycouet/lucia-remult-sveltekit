import type { Adapter, InitializeAdapter, KeySchema, SessionSchema, UserSchema } from 'lucia';
import { remult } from 'remult';
import { User } from '../../shared/User';
import { UserSession } from '../../shared/UserSession';
import { UserKey } from '../../shared/UserKey';

type PossibleRemultError = {
	code: string;
	message: string;
};

// type ExtractModelNames<_PrismaClient extends PrismaClient> = Exclude<
// 	keyof _PrismaClient,
// 	`$${string}`
// >;

export const remultAdapter = <_PrismaClient extends PrismaClient>(): // client: _PrismaClient
// modelNames?: {
// 	user: ExtractModelNames<_PrismaClient>;
// 	session: ExtractModelNames<_PrismaClient> | null;
// 	key: ExtractModelNames<_PrismaClient>;
// }
InitializeAdapter<Adapter> => {
	// const getModels = () => {
	// 	if (!modelNames) {
	// 		return {
	// 			User: client['user'] as SmartPrismaModel<UserSchema>,
	// 			Session: (client['session'] as SmartPrismaModel<SessionSchema>) ?? null,
	// 			Key: client['key'] as SmartPrismaModel<KeySchema>
	// 		};
	// 	}
	// 	return {
	// 		User: client[modelNames.user] as SmartPrismaModel<UserSchema>,
	// 		Session: modelNames.session
	// 			? (client[modelNames.session] as SmartPrismaModel<SessionSchema>)
	// 			: null,
	// 		Key: client[modelNames.key] as SmartPrismaModel<KeySchema>
	// 	};
	// };
	// const { User, Session, Key } = getModels();

	const repo_User = remult.repo(User);
	const repo_Session = remult.repo(UserSession);
	const repo_UserKey = remult.repo(UserKey);

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
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				const result = await repo_Session.findFirst({
					id: sessionId
				});
				if (!result) return null;
				return transformPrismaSession(result);
			},
			getSessionsByUserId: async (userId) => {
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				const sessions = await repo_Session.find({
					where: {
						user_id: userId
					}
				});
				return sessions.map((session) => transformPrismaSession(session));
			},
			setSession: async (session) => {
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				try {
					await repo_Session.insert(session);
				} catch (e) {
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2003') {
						throw new LuciaError('AUTH_INVALID_USER_ID');
					}

					throw error;
				}
			},
			deleteSession: async (sessionId) => {
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				try {
					await repo_Session.delete(sessionId);
				} catch (e) {
					const error = e as Partial<PossibleRemultError>;
					if (error.code === 'P2025') {
						// session does not exist
						return;
					}
					throw e;
				}
			},
			deleteSessionsByUserId: async (userId) => {
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				const all = await repo_Session.find({ where: { user_id: userId } });
				for (const session of all) {
					await repo_Session.delete(session.id);
				}
			},
			updateSession: async (userId, partialSession) => {
				// if (!Session) {
				// 	throw new Error('Session table not defined');
				// }
				await repo_Session.update(userId, partialSession);
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

export const transformPrismaSession = (sessionData: UserSession): SessionSchema => {
	const { active_expires, idle_expires, ...data } = sessionData;
	// TODO
	// @ts-ignore
	return {
		...data,
		active_expires: Number(active_expires),
		idle_expires: Number(idle_expires)
	};
};

type PrismaClient = {
	$transaction: (...args: any) => any;
} & { [K: string]: any };

export type RemultSession = Omit<SessionSchema, 'active_expires' | 'idle_expires'> & {
	active_expires: BigInt | number;
	idle_expires: BigInt | number;
};

export type SmartPrismaModel<_Schema = any> = {
	findUnique: <_Included = {}>(options: {
		where: Partial<_Schema>;
		include?: Partial<Record<string, boolean>>;
	}) => Promise<null | _Schema> & _Included;
	findMany: (options?: { where: Partial<_Schema> }) => Promise<_Schema[]>;
	create: (options: { data: _Schema }) => Promise<_Schema>;
	delete: (options: { where: Partial<_Schema> }) => Promise<void>;
	deleteMany: (options?: { where: Partial<_Schema> }) => Promise<void>;
	update: (options: { data: Partial<_Schema>; where: Partial<_Schema> }) => Promise<_Schema>;
};

import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { remult } from 'remult';
import { EmailVerificationToken } from '../../shared/EmailVerificationToken.js';
import { PasswordResetToken } from '../../shared/PasswordResetToken.js';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const repo = remult.repo(EmailVerificationToken);
	const storedUserTokens = await repo.find({ where: { user_id: userId } });
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await repo.insert({
		id: token,
		expires: new Date().getTime() + EXPIRES_IN,
		user_id: userId
	});
	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const repo = remult.repo(EmailVerificationToken);

	const storedToken = await repo.findFirst({ id: token });
	if (!storedToken) {
		throw new Error('Invalid token');
	}
	await repo.delete({ user_id: storedToken.user_id });

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
	const repo = remult.repo(PasswordResetToken);
	const storedUserTokens = await repo.find({ where: { user_id: userId } });
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token: any) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await repo.insert({
		id: token,
		expires: new Date().getTime() + EXPIRES_IN,
		user_id: userId
	});
	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	const repo = remult.repo(PasswordResetToken);

	const storedToken = await repo.findFirst({ id: token });
	if (!storedToken) {
		throw new Error('Invalid token');
	}
	await repo.delete({ user_id: storedToken.user_id });
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};

export const isValidPasswordResetToken = async (token: string) => {
	const repo = remult.repo(PasswordResetToken);
	const storedToken = await repo.findFirst({ id: token });
	if (!storedToken) return false;
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		return false;
	}
	return true;
};

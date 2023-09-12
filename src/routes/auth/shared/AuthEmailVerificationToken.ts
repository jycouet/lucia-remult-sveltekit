import { Entity, Fields } from 'remult';

@Entity('authEmailVerificationTokens', {
	dbName: 'auth_email_verification_token',
	allowApiCrud: false
})
export class AuthEmailVerificationToken {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.number()
	expires!: number;
}

import { Entity, Fields } from 'remult';

@Entity('emailVerificationTokens', {
	dbName: 'email_verification_token',
	allowApiCrud: false
})
export class EmailVerificationToken {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.integer()
	expires!: number;
}

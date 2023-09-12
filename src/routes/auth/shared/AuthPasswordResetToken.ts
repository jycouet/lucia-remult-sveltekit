import { Entity, Fields } from 'remult';

@Entity('authPasswordResetTokens', {
	dbName: 'auth_password_reset_token',
	allowApiCrud: false
})
export class AuthPasswordResetToken {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.number()
	expires!: number;
}

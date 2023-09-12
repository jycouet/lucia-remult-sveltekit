import { Entity, Fields } from 'remult';

@Entity('passwordResetTokens', {
	dbName: 'password_reset_token',
	allowApiCrud: false
})
export class PasswordResetToken {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.integer()
	expires!: number;
}

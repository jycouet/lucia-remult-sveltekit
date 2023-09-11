import { Entity, Fields } from 'remult';

@Entity('passwordResetTokens', {
	dbName: 'password_reset_token'
})
export class PasswordResetToken {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.integer()
	expires!: number;
}

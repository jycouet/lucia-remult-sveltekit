import { Entity, Fields } from 'remult';

@Entity('authUserKeys', {
	dbName: 'auth_user_key',
	allowApiCrud: false
})
export class AuthUserKey {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.string()
	hashed_password!: string;
}

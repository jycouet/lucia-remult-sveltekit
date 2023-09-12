import { Entity, Fields } from 'remult';

@Entity('authUsers', {
	dbName: 'auth_user'
})
export class AuthUser {
	@Fields.cuid()
	id!: string;

	@Fields.string()
	email!: string;

	@Fields.boolean()
	email_verified!: boolean;
}

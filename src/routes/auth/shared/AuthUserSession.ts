import { Entity, Fields } from 'remult';

@Entity('userSessions', {
	dbName: 'auth_user_session',
	allowApiCrud: false
})
export class AuthUserSession {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.number()
	active_expires!: number;

	@Fields.number()
	idle_expires!: number;
}

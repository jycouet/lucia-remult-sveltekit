import { Entity, Fields } from 'remult';

@Entity('userSessions', {
	dbName: 'user_session',
	allowApiCrud: false
})
export class UserSession {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.integer()
	active_expires!: number;

	@Fields.integer()
	idle_expires!: number;
}

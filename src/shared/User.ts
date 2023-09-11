import { Entity, Fields } from 'remult';

@Entity('users', {
	dbName: 'public.user'
})
export class User {
	@Fields.string()
	id!: string;

	@Fields.string()
	email!: string;

	@Fields.integer()
	email_verified!: number;
}

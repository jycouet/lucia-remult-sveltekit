import { Entity, Fields } from 'remult';

@Entity('authUsers', {
	dbName: 'public.user'
})
export class User {
	@Fields.cuid()
	id!: string;

	@Fields.string()
	email!: string;
}

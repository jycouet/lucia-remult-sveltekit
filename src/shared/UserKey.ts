import { Entity, Fields } from 'remult';

@Entity('userKeys', {
	dbName: 'user_key'
})
export class UserKey {
	@Fields.string()
	id!: string;

	@Fields.string()
	user_id!: string;

	@Fields.string({ allowNull: true })
	hashed_password!: string;
}

import { Entity, Fields, IdEntity, remult, SqlDatabase } from 'remult';

@Entity(undefined!, {
	dbName: '_remult_migrations'
})
export class RemultMigration {
	@Fields.integer()
	version: number = 0;

	@Fields.string()
	description!: string;

	@Fields.createdAt({ dbName: '"createdAt"' })
	createdAt = new Date();

	@Fields.updatedAt({ dbName: '"endedAt"' })
	endedAt = new Date();

	@Fields.string({ allowNull: true })
	logs?: string;
}

export async function migrationUp() {
	let allEntries: RemultMigration[] = [];

	try {
		allEntries = await remult.repo(RemultMigration).find();
	} catch (error) {
		const sql = SqlDatabase.getDb();
		const cmd = sql.createCommand();
		await cmd.execute(`
			CREATE table _remult_migrations (
				version integer default 0 not null primary key,
				description varchar default '' not null,
				"createdAt" timestamp,
				"endedAt" timestamp,
				logs varchar
			)
		`);
	}

	let moveUpTo = async (version: number, description: string, runTheJob: () => Promise<void>) => {
		const found = allEntries.find((x) => x.version == version);
		if (found) {
			// Nothing to do... It's already done!
		} else {
			const newMigration = remult.repo(RemultMigration).create({ version, description });
			await remult.repo(RemultMigration).insert(newMigration);
			try {
				await runTheJob();
				await remult.repo(RemultMigration).update(version, { ...newMigration, logs: 'DONE' });
			} catch (error) {
				await remult
					.repo(RemultMigration)
					.update(version, { ...newMigration, logs: JSON.stringify(error, null, 2) });
			}
		}
	};

	// Lets start here...

	await moveUpTo(1, 'create "auth" tables', async () => {
		const sql = SqlDatabase.getDb();
		const cmd = sql.createCommand();
		await cmd.execute(`
		CREATE TABLE auth_user(
			id varchar NOT NULL PRIMARY KEY,
			email varchar NOT NULL,
			email_verified boolean DEFAULT FALSE NOT NULL
		);
		
		CREATE TABLE auth_user_key(
				id varchar NOT NULL PRIMARY KEY,
				user_id varchar NOT NULL,
				hashed_password varchar NOT NULL,
				FOREIGN KEY (user_id) REFERENCES auth_user(id)
		);
		
		CREATE TABLE auth_user_session(
				id varchar NOT NULL PRIMARY KEY,
				user_id varchar NOT NULL,
				active_expires bigint NOT NULL,
				idle_expires bigint NOT NULL,
				username varchar DEFAULT '' NOT NULL,
				roles varchar DEFAULT '' NOT NULL,
				FOREIGN KEY (user_id) REFERENCES auth_user(id)
		);
		
		CREATE TABLE auth_email_verification_token(
				id varchar NOT NULL PRIMARY KEY,
				user_id varchar NOT NULL,
				expires bigint NOT NULL
		);
		
		CREATE TABLE auth_password_reset_token(
				id varchar NOT NULL PRIMARY KEY,
				user_id varchar NOT NULL,
				expires bigint NOT NULL
		);	
		`);
	});
}

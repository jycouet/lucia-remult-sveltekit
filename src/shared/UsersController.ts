import { BackendMethod, remult } from 'remult';
import { AuthUser } from '../routes/auth/shared/AuthUser';

export class UsersController {
	@BackendMethod({ allowed: true, paramTypes: [] })
	static async getAllUsers() {
		const repo = remult.repo(AuthUser);
		return await repo.find();
	}
}

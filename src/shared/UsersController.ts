import { BackendMethod, remult } from 'remult';
import { User } from './User';

export class UsersController {
	@BackendMethod({ allowed: true, paramTypes: [] })
	static async getAllUsers() {
		const repo = remult.repo(User);
		return await repo.find();
	}
}

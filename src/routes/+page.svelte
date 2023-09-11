<script lang="ts">
	import { enhance } from '$app/forms';
	import { remult } from 'remult';

	import type { PageData } from './$types';
	import { UsersController } from '../shared/UsersController';

	export let data: PageData;
	remult.user = { id: data.userId };

	const calllll = async () => {
		const tt = await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		console.log(`tt`, tt);
	};
</script>

<h1>Profile</h1>
<p>User id: {data.userId} {remult.user?.id}</p>
<p>Email: {data.email}</p>
<form method="post" action="?/logout" use:enhance>
	<input type="submit" value="Sign out" />
</form>

<button on:click={calllll}>sdsd</button>

<script lang="ts">
	import { remult } from 'remult';

	import { UsersController } from '../../shared/UsersController';
	import Logout from '../auth/Logout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: remult.user = data.user;

	let users = {};
	const getAllUsers = async () => {
		users = await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		await UsersController.getAllUsers();
	};
</script>

<p>You are in the <b>private</b> space.</p>
<h2>Authenticated</h2>
<p>User id: {remult.user?.id} {remult.user?.id}</p>
<p>Email: {remult.user?.email}</p>

<Logout />

<hr />

<button on:click={getAllUsers}>GetAllUsers</button>
<pre>{JSON.stringify(users, null, 2)}</pre>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { remult } from 'remult';

	import type { PageData } from './$types';
	import { UsersController } from '../../shared/UsersController';
	import Logout from '../auth/Logout.svelte';

	export let data: PageData;
	remult.user = { id: data.userId };

	let users = {};
	const getAllUsers = async () => {
		users = await UsersController.getAllUsers();
		await UsersController.getAllUsers();
		await UsersController.getAllUsers();
	};
</script>

<p>You are in the <b>private</b> space.</p>
<h2>Authenticated</h2>
<p>User id: {data.userId} {remult.user?.id}</p>
<p>Email: {data.email}</p>

<Logout />

<hr />

<button on:click={getAllUsers}>GetAllUsers</button>
<pre>{JSON.stringify(users, null, 2)}</pre>

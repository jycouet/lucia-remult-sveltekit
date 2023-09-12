<script lang="ts">
	import { enhance } from '$app/forms';
	import { AUTH_ROUTES } from '$auth/AUTH_ROUTES';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = '';
</script>

<h1>Login</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" bind:value={email} /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>
{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
<a href={AUTH_ROUTES.password_reset(email)}>Reset password</a>
<a href={AUTH_ROUTES.signup()}>Create an account</a>

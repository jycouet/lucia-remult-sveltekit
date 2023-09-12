<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { AUTH_ROUTES } from '../AUTH_ROUTES';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = $page.url.searchParams.get('email') || '';
</script>

<h1>Reset password</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" bind:value={email} /><br />
	<input type="submit" />
</form>
{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
{#if form?.success}
	<p>Your password reset link was sent to your inbox</p>
{/if}
<a href={AUTH_ROUTES.login()}>Login</a>

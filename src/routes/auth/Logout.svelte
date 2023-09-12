<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { AUTH_ROUTES } from '$auth/AUTH_ROUTES';
</script>

<form
	method="POST"
	use:enhance={({}) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto('/', { invalidateAll: true });
			}
		};
	}}
	action={AUTH_ROUTES.logout()}
>
	<button>Se déconnecter</button>
</form>

<style>
	form {
		display: inline-block;
	}
</style>

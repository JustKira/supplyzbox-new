<script>
	import { register } from '@teamhanko/hanko-elements';
	import { onMount } from 'svelte';

	import { goto, invalidateAll } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	const hankoApi = env.PUBLIC_HANKO_API_URL;

	const redirectAfterLogin = async () => {
		await invalidateAll();
		goto('/');
	};

	onMount(async () => {
		if (!hankoApi) {
			console.error('Failed to load HANKO API URL from environment variables');
			return;
		}
		register(hankoApi).catch((error) => {
			console.error('Failed to register HANKO Elements:', error);
		});
	});
</script>

<div class="flex h-[calc(100vh-theme(space.12))] items-center justify-center">
	<hanko-login on:onSessionCreated={redirectAfterLogin}></hanko-login>
</div>

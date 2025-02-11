<script>
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { i18n } from '$lib/i18n';
	import { Hanko } from '@teamhanko/hanko-elements';

	import Button from '$lib/components/ui/button/button.svelte';

	const hankoApi = env.PUBLIC_HANKO_API_URL;

	const logout = async () => {
		if (browser) {
			const hanko = new Hanko(hankoApi);

			await hanko.user.logout();

			await invalidateAll();

			goto(i18n.resolveRoute(''));
		}
	};
</script>

<Button class="w-full" onclick={logout}>Logout</Button>

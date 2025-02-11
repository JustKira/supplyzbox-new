<script lang="ts">
	import HankoLogout from '$lib/components/hanko-logout.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { User } from '$lib/surrealdb/models/user';

	let { user }: { user: User | null } = $props();
</script>

<div class="sticky top-0 h-12 w-full border-b">
	<nav class="flex h-full items-center justify-between px-6 md:px-10">
		<img src="logo.svg" alt="logo" class="size-10" />

		<ul>
			{#if user}
				<li>
					{user.first_name}
					{user.last_name}
				</li>
				<li>
					<HankoLogout />
				</li>
			{:else}
				<li>
					<Button href="/login">Login</Button>
				</li>
			{/if}
		</ul>
	</nav>
</div>

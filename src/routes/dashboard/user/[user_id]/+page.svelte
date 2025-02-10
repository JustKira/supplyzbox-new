<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import UpdateUserForm from './update-user-form.svelte';

	let { data } = $props();

	$effect(() => {
		$inspect(data.user);
	});
</script>

<section class="flex flex-col gap-2">
	<div class="flex flex-col gap-2 rounded-lg border p-2">
		<h1 class="font-mono text-xs font-medium uppercase text-muted-foreground">
			{data.user.id}
		</h1>
		<Button variant="secondary" class="max-w-40" onclick={() => goto('/dashboard/user')}>
			Back
		</Button>
	</div>

	<div>
		<UpdateUserForm form={data.form} values={data.user} />
	</div>
</section>

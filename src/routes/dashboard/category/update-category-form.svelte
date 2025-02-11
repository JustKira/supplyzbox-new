<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { UpdateCategorySchema } from '$lib/surrealdb/models/category';
	import { watch } from 'runed';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let data: {
		form: SuperValidated<Infer<typeof UpdateCategorySchema>>;
		initialData: {
			id: string;
			name: string;
		};
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(UpdateCategorySchema),
		resetForm: false,
		onSubmit() {
			toast.loading('Updating Category...', { id: 'LOADING' });
		},
		onUpdated({ form }) {
			toast.dismiss('LOADING');
			if (form.valid) {
				toast.success(form.message.text);
			} else {
				toast.error('Failed to submit form');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	watch(
		() => form,
		() => {
			console.log('Changed');
		}
	);

	$effect(() => {
		if (form) {
			$formData = {
				...data.initialData,
				id: data.initialData.id.split(':')[1]
			};
		}
	});
</script>

<div class="flex flex-col gap-2 bg-background">
	<form
		method="post"
		action="?/update"
		use:enhance
		class="flex w-full max-w-96 shrink-0 items-end gap-2"
	>
		<input type="hidden" name="id" bind:value={$formData.id} />
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Category Name</Form.Label>
						<Input bind:value={$formData.name} {...props} />
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.Button disabled={$delayed} variant="brand" class="w-32">Update</Form.Button>
	</form>
</div>

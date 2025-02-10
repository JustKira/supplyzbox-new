<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CreateCategorySchema } from '$lib/surrealdb/models/category/schema';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let data: {
		form: SuperValidated<Infer<typeof CreateCategorySchema>>;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(CreateCategorySchema),
		resetForm: false,
		onSubmit() {
			toast.loading('Creating Category...', { id: 'LOADING' });
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
</script>

<div class="flex gap-2 bg-background">
	<form
		method="post"
		action="?/add-category"
		use:enhance
		class="flex w-full max-w-96 shrink-0 items-end gap-2"
	>
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

		<Form.Button disabled={$delayed} class="w-32">Add</Form.Button>
	</form>
</div>

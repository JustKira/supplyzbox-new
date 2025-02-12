<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CreateProductSchema } from '$lib/surrealdb/models/product/schema';

	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';

	let data: {
		form: SuperValidated<Infer<typeof CreateProductSchema>>;
		category: string;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(CreateProductSchema),
		resetForm: true,
		dataType: 'json',
		onSubmit() {
			toast.loading('Creating Product...', { id: 'LOADING' });
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

	$effect(() => {
		$formData.category = data.category;
	});
</script>

<form
	method="post"
	action="?/add"
	use:enhance
	class="flex w-full max-w-96 shrink-0 items-end gap-2"
>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-1">
					<Form.Label>Name</Form.Label>
					<Input bind:value={$formData.name} {...props} />
				</div>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button disabled={$delayed} variant="brand" class="w-32">Add</Form.Button>
</form>

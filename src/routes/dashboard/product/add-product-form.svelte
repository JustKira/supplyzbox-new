<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CreateProductSchema } from '$lib/surrealdb/models/product/schema';

	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';

	let data: {
		form: SuperValidated<Omit<Infer<typeof CreateProductSchema>, 'category'>>;
		category?: string;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(CreateProductSchema.omit({ category: true })),
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
</script>

<div class="flex items-end gap-2">
	<div
		data-category-selected={Boolean(data.category)}
		class="flex gap-2 duration-300 data-[category-selected=false]:opacity-50"
	>
		<form
			method="post"
			action="?/add-product&category={data.category}"
			use:enhance
			class="flex w-full max-w-96 shrink-0 items-end gap-2"
		>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex flex-col gap-1">
							<Form.Label>Product Name</Form.Label>
							<Input bind:value={$formData.name} {...props} />
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Button disabled={!data.category || $delayed} class="w-24">Add</Form.Button>
		</form>
	</div>
	{#if !data.category}
		<h1 class="font-mono text-xs text-yellow-300">Select a category to add a product</h1>
	{/if}
</div>

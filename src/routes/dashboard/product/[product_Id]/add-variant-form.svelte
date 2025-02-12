<script lang="ts">
	import { browser, dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CreateProductVariantSchema } from '$lib/surrealdb/models/variant';

	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';

	let data: {
		form: SuperValidated<Omit<Infer<typeof CreateProductVariantSchema>, 'category'>>;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(CreateProductVariantSchema),
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

<form
	method="post"
	action="?/add-variant"
	enctype="multipart/form-data"
	class="flex w-full max-w-96 shrink-0 flex-col gap-2"
	use:enhance
>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-1">
					<Form.Label>Variant Name</Form.Label>
					<Input bind:value={$formData.name} {...props} />
				</div>
			{/snippet}
		</Form.Control><Form.FieldErrors />
	</Form.Field>
	<div class="flex justify-between gap-2">
		<Form.Field {form} name="price">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Price</Form.Label>
						<Input type="number" bind:value={$formData.price} {...props} />
					</div>
				{/snippet}
			</Form.Control><Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="stock">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Stock</Form.Label>
						<Input type="number" bind:value={$formData.stock} {...props} />
					</div>
				{/snippet}
			</Form.Control><Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Field {form} name="image">
		<Form.Control>
			{#snippet children()}
				<div class="flex flex-col gap-1">
					<Form.Label>File</Form.Label>
					<Input
						type="file"
						accept="image/png, image/jpeg"
						oninput={(e) => ($formData.image = e.currentTarget.files?.item(0) as File)}
						placeholder="Upload Image"
						name="image"
					/>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$delayed}>Add</Form.Button>

	{#if browser}
		<div class="mt-2">
			<SuperDebug data={$formData} theme="vscode" display={dev} />
		</div>
	{/if}
</form>

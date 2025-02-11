<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { DeleteCategorySchema } from '$lib/surrealdb/models/category';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	let data: {
		form: SuperValidated<Infer<typeof DeleteCategorySchema>>;
		id: string;
		onSuccess: () => void;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(DeleteCategorySchema),
		resetForm: true,
		onSubmit() {
			toast.loading('Deleting Category...', { id: 'LOADING' });
		},
		onUpdated({ form }) {
			toast.dismiss('LOADING');
			if (form.valid) {
				toast.success(form.message.text);
				data.onSuccess();
			} else {
				toast.error('Failed to submit form');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	$effect(() => {
		$formData.id = data.id.split(':')[1];
	});
</script>

<div class="flex flex-col gap-2 bg-background">
	<form
		method="post"
		action="?/delete"
		use:enhance
		class="flex w-full max-w-96 shrink-0 items-end gap-2"
	>
		<input type="hidden" name="id" bind:value={$formData.id} />

		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Delete</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Delete Category</Dialog.Title>
					<Dialog.Description
						>Are you sure you want to delete this category? this action is irreversible</Dialog.Description
					>
				</Dialog.Header>
				<Form.Button disabled={$delayed} variant="brand" class="w-32">Update</Form.Button>
			</Dialog.Content>
		</Dialog.Root>
	</form>
</div>

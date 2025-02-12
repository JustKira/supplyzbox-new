<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CreateSchoolSchema } from '$lib/surrealdb/models/school';

	import { toast } from 'svelte-sonner';
	import { superForm, type FormPath, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import Plus from '~icons/ph/plus';
	import Trash from '~icons/ph/trash';

	let data: {
		form: SuperValidated<Infer<typeof CreateSchoolSchema>>;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(CreateSchoolSchema),
		dataType: 'json',
		onSubmit() {
			toast.loading('Creating School...', { id: 'LOADING' });
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
	action="?/add"
	enctype="multipart/form-data"
	class="flex w-full max-w-96 shrink-0 flex-col gap-2"
	use:enhance
>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-1">
					<Form.Label>Name</Form.Label>
					<Input bind:value={$formData.name} {...props} />
				</div>
			{/snippet}
		</Form.Control><Form.FieldErrors />
	</Form.Field>

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

	<div class="rounded-lg border bg-accent p-[1px]">
		<h1 class="mx-2 mt-1 text-xs text-muted-foreground">Grades</h1>
		<div class="flex flex-col gap-2 rounded-md border bg-background p-1">
			<Button
				size="icon"
				variant="secondary"
				type="button"
				onclick={() => {
					$formData.grades = [...$formData.grades, { name: '' }];
				}}
			>
				<Plus />
			</Button>

			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each $formData.grades as _, index}
				<Form.Field {form} name={`grades.${index}.name` as FormPath<typeof formData, 'name'>}>
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex flex-col gap-1">
								<Form.Label># {index + 1} Name</Form.Label>
								<div class="flex gap-0.5">
									<Input bind:value={$formData.grades[index].name} {...props} />
									<Button
										size="icon"
										class="shrink-0"
										variant={'destructive'}
										onclick={() => {
											$formData.grades = $formData.grades.filter((_, i) => i !== index);
										}}
									>
										<Trash />
									</Button>
								</div>
							</div>
						{/snippet}
					</Form.Control><Form.FieldErrors />
				</Form.Field>
			{/each}
		</div>
	</div>

	<Form.Button disabled={$delayed} variant="brand">Add</Form.Button>
</form>

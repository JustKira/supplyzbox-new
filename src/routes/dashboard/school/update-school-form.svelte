<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { UpdateSchoolSchema } from '$lib/surrealdb/models/school';
	import { watch } from 'runed';
	import { toast } from 'svelte-sonner';
	import SuperDebug, {
		superForm,
		type FormPath,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import Undo from '~icons/ph/arrow-u-up-left';
	import Plus from '~icons/ph/plus';
	import Trash from '~icons/ph/trash';

	let data: {
		form: SuperValidated<Infer<typeof UpdateSchoolSchema>>;
		initialData: {
			id: string;
			name: string;
			grades: { name: string; id: string }[];
		};
		onSuccess: () => void;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(UpdateSchoolSchema),
		dataType: 'json',
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
			data.onSuccess();
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
			$formData.name = data.initialData.name;
			$formData.grades_to_update = data.initialData.grades.map((grade) => {
				return {
					id: grade.id.split(':')[1],
					name: grade.name
				};
			});
			$formData.id = data.initialData.id.split(':')[1];
		}
	});
</script>

<div class="flex flex-col gap-2 bg-background">
	<form
		method="post"
		action="?/update"
		use:enhance
		class="flex w-full max-w-96 shrink-0 flex-col gap-2"
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

		<div class="rounded-lg border bg-accent p-[1px]">
			<h1 class="mx-2 mt-1 text-xs text-muted-foreground">Grades Existed</h1>
			<div class="flex flex-col gap-2 rounded-md border bg-background p-1">
				<ul class="flex flex-col gap-2 p-1">
					{#each $formData.grades_to_update as { name, id }, index}
						{@const isMarked = $formData.grades_to_remove.includes(id)}
						<li
							data-is-marked={isMarked}
							class="flex items-center justify-between rounded-xl border p-1 duration-300 data-[is-marked=true]:border-destructive data-[is-marked=true]:bg-destructive/25"
						>
							<Form.Field
								{form}
								class="flex h-full items-center"
								name={`grades_to_update.${index}.name` as FormPath<typeof formData, 'name'>}
							>
								<Form.Control>
									{#snippet children({ props })}
										<Input
											disabled={isMarked}
											bind:value={$formData.grades_to_update[index].name}
											{...props}
										/>
									{/snippet}
								</Form.Control><Form.FieldErrors />
							</Form.Field>

							<Button
								size="icon"
								variant={isMarked ? 'secondary' : 'destructive'}
								onclick={() => {
									if (isMarked) {
										$formData.grades_to_remove = $formData.grades_to_remove.filter(
											(grade) => grade !== id
										);
									} else {
										$formData.grades_to_remove = [...$formData.grades_to_remove, id];
									}
								}}
							>
								{#if isMarked}
									<Undo />
								{:else}
									<Trash />
								{/if}
							</Button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="rounded-lg border bg-accent p-[1px]">
			<h1 class="mx-2 mt-1 text-xs text-muted-foreground">Grades</h1>
			<div class="flex flex-col gap-2 rounded-md border bg-background p-1">
				<Button
					size="icon"
					variant="secondary"
					type="button"
					onclick={() => {
						$formData.grades_to_add = [...$formData.grades_to_add, ''];
					}}
				>
					<Plus />
				</Button>

				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each $formData.grades_to_add as _, index}
					<Form.Field {form} name={`grades_to_add.${index}` as FormPath<typeof formData, 'name'>}>
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex flex-col gap-1">
									<Form.Label># {index + 1} Name</Form.Label>
									<div class="flex gap-0.5">
										<Input bind:value={$formData.grades_to_add[index]} {...props} />
										<Button
											size="icon"
											class="shrink-0"
											variant={'destructive'}
											onclick={() => {
												$formData.grades_to_add = $formData.grades_to_add.filter(
													(_, i) => i !== index
												);
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
		<Form.Button disabled={$delayed} variant="brand" class="w-full">Update</Form.Button>
	</form>
</div>

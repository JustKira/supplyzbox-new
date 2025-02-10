<script lang="ts">
	import { UpdateUserSchema } from '$lib/surrealdb/models/user/schema';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import UserGear from '~icons/ph/user-gear';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let data: {
		form: SuperValidated<Infer<typeof UpdateUserSchema>>;
		values: Infer<typeof UpdateUserSchema>;
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(UpdateUserSchema),
		resetForm: false,
		onSubmit() {
			toast.loading('Updating user...', { id: 'LOADING' });
		},
		async onUpdate({ form, result }) {
			toast.dismiss('LOADING');
			if (result.type === 'success') {
				toast.success(form.message.text);
			} else if (result.type === 'failure') {
				toast.error('Failed to submit form');
			}

			await invalidate('user:update');
		}
	});

	const { form: formData, enhance, delayed } = form;

	onMount(() => {
		$formData = data.values;
	});
</script>

<div class="flex gap-2 bg-background">
	<form
		method="post"
		action="?/update-user"
		use:enhance
		class="flex w-full max-w-96 shrink-0 flex-col gap-1"
	>
		<div class="flex gap-2 *:w-1/2">
			<Form.Field {form} name="first_name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex flex-col gap-1">
							<Form.Label>First Name</Form.Label>
							<Input bind:value={$formData.first_name} {...props} />
						</div>
					{/snippet}
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="last_name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex flex-col gap-1">
							<Form.Label>Last Name</Form.Label>
							<Input bind:value={$formData.last_name} {...props} />
						</div>
					{/snippet}
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Email</Form.Label>
						<Input bind:value={$formData.email} {...props} />
					</div>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="phone_number">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Phone</Form.Label>
						<Input bind:value={$formData.phone_number} {...props} />
					</div>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="role">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col gap-1">
						<Form.Label>Role</Form.Label>
						<Select.Root type="single" bind:value={$formData.role} name={props.name}>
							<Select.Trigger {...props} class="font-medium">
								<div class="flex gap-2">
									<UserGear />
									{$formData.role ? $formData.role : 'Select Role'}
								</div>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="USER">User</Select.Item>
								<Select.Item value="ADMIN">Admin</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={$delayed} class="w-full">Update</Form.Button>
	</form>
</div>

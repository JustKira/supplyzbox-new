<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	import CheckFat from '~icons/ph/check-fat';
	import CheckFatFilled from '~icons/ph/check-fat-fill';

	import PencilRuler from '~icons/ph/pencil-ruler';

	import type { Category } from '$lib/surrealdb/models/category';

	let { result, selected = $bindable(null) }: { result: Category[]; selected: Category | null } =
		$props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="min-w-12"></Table.Head>
			<Table.Head class="w-full">Name</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each result as category}
			{@const isSelected = selected?.id === category.id}
			<Table.Row
				onclick={() => (selected = category)}
				data-selected={isSelected}
				class="group cursor-pointer"
			>
				<Table.Cell>
					<div
						class="group-data-[selected=true]:text-brand flex w-full items-center justify-center gap-2"
					>
						{#if isSelected}
							<CheckFatFilled />
						{:else}
							<CheckFat />
						{/if}
					</div>
				</Table.Cell>
				<Table.Cell class="font-medium">{category.name}</Table.Cell>
				<Table.Cell class="flex gap-0.5">
					<Button
						variant={'secondary'}
						size={'sm'}
						href={`/dashboard/product?category=${category.id.split(':')[1]}`}
					>
						<PencilRuler /> + Products
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

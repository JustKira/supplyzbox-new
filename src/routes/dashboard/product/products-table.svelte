<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	import Pencil from '~icons/ph/pencil';
	import PencilRuler from '~icons/ph/pencil-ruler';
	import CheckFat from '~icons/ph/check-fat';
	import CheckFatFilled from '~icons/ph/check-fat-fill';

	import type { Product } from '$lib/surrealdb/models/product';

	let { result, selected = $bindable(null) }: { result: Product[]; selected: Product | null } =
		$props();
</script>

<Table.Root class="w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="min-w-12"></Table.Head>
			<Table.Head class="w-full">Name</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each result as product}
			{@const isSelected = selected?.id === product.id}
			<Table.Row
				onclick={() => (selected = product)}
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
				<Table.Cell class="font-medium">{product.name}</Table.Cell>
				<Table.Cell class="flex gap-0.5">
					<Button
						size="icon"
						variant="outline"
						href={`/dashboard/product/${product.id.split(':')[1]}`}
					>
						<Pencil />
					</Button>
					<Button variant="outline" href={`/dashboard/product/${product.id.split(':')[1]}`}>
						<PencilRuler /> + Variants
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

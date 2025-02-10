<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	import Pencil from '~icons/ph/pencil';
	import PencilRuler from '~icons/ph/pencil-ruler';

	import type { Product } from '$lib/surrealdb/models/product';

	let {
		result,
		count,
		page = $bindable()
	}: { result: Product[]; count: number; page?: number } = $props();
</script>

<div class="flex flex-col gap-2 overflow-clip rounded-lg border p-4">
	<Table.Root class="w-full">
		<Table.Header>
			<Table.Row>
				<Table.Head>Actions</Table.Head>
				<Table.Head class="w-full">Name</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each result as product}
				<Table.Row class="cursor-pointer hover:bg-transparent">
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
					<Table.Cell class="font-medium">{product.name}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Pagination.Root
		class="sticky bottom-5 flex w-fit items-start rounded-lg border bg-accent/50 p-2 backdrop-blur-sm"
		{count}
		perPage={15}
		page={page ?? 1}
		onPageChange={(p) => {
			page = p;
		}}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>

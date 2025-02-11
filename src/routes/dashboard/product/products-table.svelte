<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	import Pencil from '~icons/ph/pencil';
	import PencilRuler from '~icons/ph/pencil-ruler';

	import type { Product } from '$lib/surrealdb/models/product';

	let { result }: { result: Product[] } = $props();
</script>

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

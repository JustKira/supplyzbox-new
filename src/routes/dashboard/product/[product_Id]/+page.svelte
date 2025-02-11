<script>
	import AddVariantForm from './add-variant-form.svelte';
	import * as Table from '$lib/components/ui/table';
	import { env } from '$env/dynamic/public';

	import Package from '~icons/ph/package-fill';
	import Coins from '~icons/ph/coins-fill';

	let { data } = $props();
</script>

<section class="flex h-full gap-2">
	<div class="h-fit w-full rounded-lg border p-4 drop-shadow-xl">
		<Table.Root class="w-full">
			<Table.Header>
				<Table.Row>
					<Table.Head class="min-w-4">Image</Table.Head>
					<Table.Head class="w-full">Name</Table.Head>
					<Table.Head class="min-w-32">Price</Table.Head>
					<Table.Head class="min-w-32">Stock</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.variants as variant}
					<Table.Row class="hover:bg-transparent">
						<Table.Cell class="p-1">
							<img
								src="{env.PUBLIC_MINIO_ENDPOINT}/{variant.image}"
								alt={variant.name}
								class=" aspect-square w-full rounded object-cover"
							/>
						</Table.Cell>
						<Table.Cell class="font-medium">{variant.name}</Table.Cell>
						<Table.Cell class="font-medium">
							<div class="flex gap-2">
								<Coins class="text-lg" />{variant.price}
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="flex gap-2">
								<Package class="text-lg" />{variant.stock}
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="w-full max-w-96 rounded-lg border bg-background p-4">
		<AddVariantForm form={data.form} />
	</div>
</section>

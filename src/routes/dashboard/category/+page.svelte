<script>
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import AddCategoryForm from './add-category-form.svelte';

	import { Button } from '$lib/components/ui/button';

	import Pencil from '~icons/ph/pencil';
	import PencilRuler from '~icons/ph/pencil-ruler';
	let { data } = $props();

	const params = queryParameters(
		{
			page: ssp.number(1)
		},
		{
			showDefaults: false
		}
	);
</script>

<section class="flex flex-col gap-2">
	<AddCategoryForm form={data.form} />

	<div class="flex flex-col gap-2 overflow-clip rounded-lg border p-4">
		<Table.Root class="w-full">
			<Table.Header>
				<Table.Row>
					<Table.Head>Actions</Table.Head>
					<Table.Head class="w-full">Name</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#await data.categories}
					<Table.Row>
						<Table.Cell>Loading...</Table.Cell>
					</Table.Row>
				{:then { result }}
					{#each result as category}
						<Table.Row class="cursor-pointer hover:bg-transparent">
							<Table.Cell class="flex gap-0.5">
								<Button
									size="icon"
									variant="outline"
									href={`/dashboard/category/${category.id.split(':')[1]}`}
								>
									<Pencil />
								</Button>
								<Button
									variant="outline"
									href={`/dashboard/product?category=${category.id.split(':')[1]}`}
								>
									<PencilRuler /> + Products
								</Button>
							</Table.Cell>
							<Table.Cell class="font-medium">{category.name}</Table.Cell>
						</Table.Row>
					{/each}
				{/await}
			</Table.Body>
		</Table.Root>
		{#await data.categories}
			<div>Loading...</div>
		{:then { count }}
			<Pagination.Root
				class="sticky bottom-5 flex w-fit items-start rounded-lg border bg-accent/50 p-2 backdrop-blur-sm"
				{count}
				perPage={15}
				page={params.page ?? 1}
				onPageChange={(p) => {
					params.page = p;
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
		{/await}
		<!-- <AddCategoryForm {data.form} /> -->
	</div>
</section>

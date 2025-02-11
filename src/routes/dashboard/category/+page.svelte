<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import AddCategoryForm from './add-category-form.svelte';

	import { Button } from '$lib/components/ui/button';

	import CheckFat from '~icons/ph/check-fat';
	import CheckFatFilled from '~icons/ph/check-fat-fill';

	import PencilRuler from '~icons/ph/pencil-ruler';
	import type { Category } from '$lib/surrealdb/models/category';
	import UpdateCategoryForm from './update-category-form.svelte';
	import DeleteCategoryForm from './delete-category-form.svelte';
	let { data } = $props();

	let selectedCategory: Category | null = $state(null);

	const params = queryParameters(
		{
			page: ssp.number(1)
		},
		{
			showDefaults: false
		}
	);
</script>

<main class="flex gap-2">
	<section class="h-fit w-full rounded-lg border bg-accent p-[2px]">
		<div class="flex h-fit flex-col gap-2 overflow-clip rounded-md border bg-background">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="min-w-12"></Table.Head>
						<Table.Head class="w-full">Name</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.categories.result as category}
						{@const isSelected = selectedCategory?.id === category.id}
						<Table.Row
							onclick={() => (selectedCategory = category)}
							data-selected={isSelected}
							class={['group cursor-pointer hover:bg-transparent']}
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
		</div>
		<Pagination.Root
			class="sticky bottom-5 my-1 flex w-fit items-start rounded-lg border bg-background backdrop-blur-sm"
			count={data.categories.count}
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
	</section>
	<section class="flex h-fit w-full max-w-96 flex-col gap-2 rounded-xl border bg-background p-2">
		<div class="rounded-lg border bg-accent p-[1px]">
			<div class="mb-1 mt-2 px-2">
				<h2 class="text-xs text-muted-foreground">Add Category</h2>
			</div>
			<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
				<AddCategoryForm form={data.createForm} />
			</div>
		</div>

		{#if selectedCategory}
			<div class="rounded-lg border bg-accent p-[1px]">
				<div class="mb-1 mt-2 px-2">
					<h2 class="text-xs text-muted-foreground">Category Actions</h2>
				</div>
				<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
					{#key data.triggerUpdate}
						<UpdateCategoryForm form={data.updateForm} initialData={selectedCategory} />
						<DeleteCategoryForm
							onSuccess={() => (selectedCategory = null)}
							form={data.deleteForm}
							id={selectedCategory.id}
						/>
					{/key}
				</div>
			</div>
		{/if}
	</section>
</main>

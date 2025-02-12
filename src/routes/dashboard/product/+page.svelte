<script lang="ts">
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import * as Select from '$lib/components/ui/select';

	import Label from '$lib/components/ui/label/label.svelte';
	import AddProductForm from './add-product-form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ProductsTable from './products-table.svelte';
	import QuickPagination from '$lib/components/quick-pagination.svelte';
	import type { Product } from '$lib/surrealdb/models/product';
	import type { Category } from '$lib/surrealdb/models/category';

	let { data } = $props();

	let selectedProduct: Product | null = $state(null);

	const params = queryParameters(
		{
			page: ssp.number(1),
			category: ssp.string(),
			search: ssp.string()
		},
		{
			showDefaults: false
		}
	);

	let selectedCategory: Category | undefined = $derived.by(() => {
		return data.categories.result.find((category) => category.id === `category:${params.category}`);
	});
	// const paramsDebounced = queryParameters(
	// 	{
	// 		page: ssp.number(1),

	// 		search: ssp.string('')
	// 	},
	// 	{
	// 		debounceHistory: 350,
	// 		showDefaults: false
	// 	}
	// );
</script>

<main class="flex gap-2">
	<section class="flex h-fit w-full flex-col gap-1 rounded-lg border bg-background p-[2px]">
		<div class="w-full rounded-lg border bg-accent p-[1px]">
			<h1 class="mx-2 my-1 text-xs text-muted-foreground">Filters</h1>
			<div class="w-full rounded-md border bg-background p-2">
				<Label>Category</Label>
				<Select.Root type="single" name="category" bind:value={params.category as string}>
					<Select.Trigger class="max-w-64">
						{#if selectedCategory}
							{selectedCategory.name}
						{:else}
							Select Category
						{/if}
					</Select.Trigger>
					<Select.Content class="Content">
						{#each data.categories.result as category}
							<Select.Item value={category.id.split(':')[1]}>{category.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div class="flex h-fit flex-col gap-2 overflow-clip rounded-md border bg-background">
			<ProductsTable result={data.products.result} bind:selected={selectedProduct} />
		</div>
		<QuickPagination bind:page={params.page} count={data.products.count} />
	</section>
	<section class="flex h-fit w-full max-w-96 flex-col gap-2 rounded-xl border bg-background p-2">
		<div class="rounded-lg border bg-accent p-[1px]">
			<div class="mb-1 mt-2 px-2">
				<h2 class="text-xs text-muted-foreground">
					{params.category
						? `Add product to Category ( ${selectedCategory?.name} )`
						: 'Select Category'}
				</h2>
			</div>
			<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
				{#if params.category}
					{#key data.triggerUpdate}
						<AddProductForm form={data.addForm} category={params.category} />
					{/key}
				{/if}
			</div>
		</div>
		{#if selectedProduct}
			<div class="rounded-lg border bg-accent p-[1px]">
				<div class="mb-1 mt-2 px-2">
					<h2 class="text-xs text-muted-foreground">Product Actions</h2>
				</div>
				<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
					{#key data.triggerUpdate}
						<!-- <UpdateCategoryForm form={data.updateForm} initialData={selectedCategory} />
						<DeleteCategoryForm
							onSuccess={() => (selectedCategory = null)}
							form={data.deleteForm}
							id={selectedCategory.id}
						/> -->
					{/key}
				</div>
			</div>
		{/if}
	</section>
</main>
<!-- <section class="flex flex-col gap-2">
	<div class="flex gap-3 rounded-lg border bg-accent/25 p-3">
		<div class="w-full max-w-80">
			<Label>Category</Label>
			<Select.Root type="single" name="category" bind:value={params.category}>
				<Select.Trigger>
					{#await data.categories}
						<div>Loading...</div>
					{:then { result }}
						{@const categories = result.find(
							(category) => category.id === `category:${params.category}`
						)}
						{#if categories}
							{categories.name}
						{:else}
							Select Category
						{/if}
					{/await}
				</Select.Trigger>
				<Select.Content class="Content">
					{#await data.categories}
						<div>Loading...</div>
					{:then { result }}
						{#each result as category}
							<Select.Item value={category.id.split(':')[1]}>{category.name}</Select.Item>
						{/each}
					{/await}
				</Select.Content>
			</Select.Root>
		</div>
		<AddProductForm form={data.form} category={params.category} />
	</div>

	<div
		class="w-full max-w-80 duration-300 data-[category-selected=false]:pointer-events-none data-[category-selected=false]:opacity-50"
		data-category-selected={Boolean(params.category)}
	>
		<Label>Search</Label>
		<Input
			bind:value={paramsDebounced.search}
			onchange={() => {
				paramsDebounced.page = 1;
			}}
		/>
	</div>
	<ProductsTable
		bind:page={params.page}
		count={data.products.count}
		result={data.products.result}
	/>
</section> -->

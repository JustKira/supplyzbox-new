<script lang="ts">
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import AddCategoryForm from './add-category-form.svelte';

	import type { Category } from '$lib/surrealdb/models/category';
	import UpdateCategoryForm from './update-category-form.svelte';
	import DeleteCategoryForm from './delete-category-form.svelte';
	import QuickPagination from '$lib/components/quick-pagination.svelte';
	import CategoryTable from './category-table.svelte';
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
			<CategoryTable result={data.categories.result} bind:selected={selectedCategory} />
		</div>
		<QuickPagination bind:page={params.page} count={data.categories.count} />
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

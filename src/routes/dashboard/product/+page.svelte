<script>
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import * as Select from '$lib/components/ui/select';

	import Label from '$lib/components/ui/label/label.svelte';
	import AddProductForm from './add-product-form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ProductsTable from './products-table.svelte';

	let { data } = $props();

	const params = queryParameters(
		{
			page: ssp.number(1),
			category: ssp.string(''),
			search: ssp.string('')
		},
		{
			showDefaults: false
		}
	);

	const paramsDebounced = queryParameters(
		{
			page: ssp.number(1),

			search: ssp.string('')
		},
		{
			debounceHistory: 150
		}
	);
</script>

<section class="flex flex-col gap-2">
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
</section>

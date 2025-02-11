<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';

	let { count, page = $bindable() }: { count: number; page?: number } = $props();
</script>

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

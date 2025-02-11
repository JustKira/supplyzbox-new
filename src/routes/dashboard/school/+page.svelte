<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import { queryParameters, ssp } from 'sveltekit-search-params';

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

<section class="flex flex-col gap-2 overflow-clip rounded-lg border p-4">
	<!-- 	
	<Pagination.Root
		class="sticky bottom-5 flex w-fit items-start rounded-lg border bg-accent/50 p-2 backdrop-blur-sm"
		count={data.users.count}
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
	</Pagination.Root> -->
</section>

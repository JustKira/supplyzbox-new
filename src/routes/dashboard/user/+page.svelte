<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const params = queryParameters(
		{
			page: ssp.number(1)
		},
		{
			showDefaults: false
		}
	);
</script>

<div class="overflow-clip rounded-lg border p-4">
	<Table.Root class="w-full">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-64">Email</Table.Head>

				<Table.Head>Name</Table.Head>
				<Table.Head>Phone Number</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#await data.users}
				<Table.Row>
					<Table.Cell>Loading...</Table.Cell>
				</Table.Row>
			{:then { result }}
				{#each result as user}
					<Table.Row
						onclick={() => goto(`/dashboard/user/${user.id.split(':')[1]}`)}
						class="cursor-pointer"
					>
						<Table.Cell class="font-medium">{user.email}</Table.Cell>

						<Table.Cell>{user.first_name} {user.last_name}</Table.Cell>
						<Table.Cell>{user.phone_number}</Table.Cell>
					</Table.Row>
				{/each}
			{/await}
		</Table.Body>
	</Table.Root>
	<Pagination.Root
		class="flex items-start"
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
	</Pagination.Root>
</div>

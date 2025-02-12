<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import CheckFat from '~icons/ph/check-fat';
	import CheckFatFilled from '~icons/ph/check-fat-fill';

	import type { IncludedCart, School } from '$lib/surrealdb/models/school';
	import { env } from '$env/dynamic/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';

	let {
		result,
		selected = $bindable(null)
	}: { result: Array<School & { grades: IncludedCart[] }>; selected: School | null } = $props();
</script>

<Table.Root class="w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="min-w-12"></Table.Head>
			<Table.Head class="min-w-14">Img</Table.Head>
			<Table.Head class="w-1/3">Name</Table.Head>
			<Table.Head class="w-full">Grades</Table.Head>

			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each result as school}
			{@const isSelected = selected?.id === school.id}
			<Table.Row
				onclick={() => (selected = school)}
				data-selected={isSelected}
				class="group cursor-pointer"
			>
				<Table.Cell>
					<div
						class="flex w-full items-center justify-center gap-2 group-data-[selected=true]:text-brand"
					>
						{#if isSelected}
							<CheckFatFilled />
						{:else}
							<CheckFat />
						{/if}
					</div>
				</Table.Cell>
				<Table.Cell class="p-1">
					<img
						src="{env.PUBLIC_MINIO_ENDPOINT}/{school.image}"
						alt={school.name}
						class=" aspect-square w-full rounded object-cover"
					/>
				</Table.Cell>
				<Table.Cell class="font-medium">{school.name}</Table.Cell>
				<Table.Cell class="font-medium">
					<div class="flex flex-row gap-0.5">
						{#each school.grades as { name }}
							<Badge variant="outline-brand">{name}</Badge>
						{/each}
					</div>
				</Table.Cell>
				<Table.Cell class="font-medium">
					<Button variant="brand" size="sm">+Add Grade</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

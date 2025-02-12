<script lang="ts">
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import SchoolTable from './school-table.svelte';
	import type { IncludedCart, School } from '$lib/surrealdb/models/school/schema.js';
	import QuickPagination from '$lib/components/quick-pagination.svelte';
	import AddSchoolForm from './add-school-form.svelte';
	import UpdateSchoolForm from './update-school-form.svelte';
	import DeleteSchoolForm from './delete-school-form.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let { data } = $props();

	let selectedSchool: (School & { grades: IncludedCart[] }) | null = $state(null);

	const params = queryParameters(
		{
			page: ssp.number(1)
		},
		{
			showDefaults: false
		}
	);
</script>

<main class="flex flex-1 gap-2">
	<section class="h-fit w-full rounded-lg border bg-accent p-[2px]">
		<div class="flex h-fit flex-col gap-2 overflow-clip rounded-md border bg-background">
			<SchoolTable result={data.schools.result} bind:selected={selectedSchool} />
		</div>
		<QuickPagination bind:page={params.page} count={data.schools.count} />
	</section>
	<ScrollArea class="w-full max-w-96">
		<section class="mr-3 flex h-fit flex-col gap-2 rounded-xl border bg-background p-2">
			<div class="rounded-lg border bg-accent p-[1px]">
				<div class="mb-1 mt-2 px-2">
					<h2 class="text-xs text-muted-foreground">Add School</h2>
				</div>
				<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
					<AddSchoolForm form={data.createForm} />
				</div>
			</div>

			{#if selectedSchool}
				<div class="rounded-lg border bg-accent p-[1px]">
					<div class="mb-1 mt-2 px-2">
						<h2 class="text-xs text-muted-foreground">School Actions</h2>
					</div>
					<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
						<UpdateSchoolForm
							form={data.updateForm}
							initialData={{
								...selectedSchool,
								grades: selectedSchool.grades.map((grade) => {
									return { name: grade.name, id: grade.id };
								})
							}}
							onSuccess={() => (selectedSchool = null)}
						/>
						<DeleteSchoolForm
							onSuccess={() => (selectedSchool = null)}
							form={data.deleteForm}
							id={selectedSchool.id}
						/>
					</div>
				</div>
			{/if}
		</section>
	</ScrollArea>
</main>

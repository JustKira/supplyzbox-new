<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
</script>

<main class="flex h-[calc(100vh-theme(space.12))] items-center justify-center p-2 md:py-24">
	<section
		class="container flex h-full flex-1 flex-col justify-between gap-2 rounded-lg border bg-muted/25 p-2"
	>
		<div class="flex flex-col gap-2 rounded-md border bg-background p-4">
			<h1 class="text-xl font-black uppercase md:text-4xl">
				{m.hero_title()}
			</h1>
			<h2 class="text-xs text-muted-foreground md:text-sm">
				{m.hero_subtitle()}
			</h2>
		</div>

		<div class="flex w-full flex-col gap-2 rounded-md border bg-background p-4">
			<h2 class="text-lg font-bold uppercase md:text-xl">{m.order_now()}</h2>

			<div class="flex w-full flex-col items-end gap-4 sm:flex-row">
				<div class="w-full min-w-40 sm:max-w-80">
					<Label>
						{m.school()}
					</Label>
					<Select.Root>
						<Select.Trigger class="h-12 rounded-full bg-muted/50 sm:h-14">
							{m.select_school()}
						</Select.Trigger>
						<Select.Content class="Content"></Select.Content>
					</Select.Root>
				</div>
				<div class="w-full sm:max-w-80">
					<Label>
						{m.grade()}
					</Label>
					<Select.Root>
						<Select.Trigger class="h-12 rounded-full bg-muted/50 sm:h-14">
							{m.select_grade()}
						</Select.Trigger>
						<Select.Content class="Content"></Select.Content>
					</Select.Root>
				</div>
				<Button class="h-12 w-full rounded-full text-lg sm:h-14 sm:max-w-52">{m.next()}</Button>
			</div>
		</div>
	</section>
</main>

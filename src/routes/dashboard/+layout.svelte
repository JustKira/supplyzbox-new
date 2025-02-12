<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import DashboardSidebar from './dashboard-sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider class="flex w-full flex-1 bg-accent">
	<DashboardSidebar />
	<div class="flex max-h-screen w-full flex-1 py-2 pr-2">
		{@render children?.()}
	</div>
</Sidebar.Provider>

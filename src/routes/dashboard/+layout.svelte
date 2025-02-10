<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import DashboardSidebar from './dashboard-sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<DashboardSidebar />
	<main class="flex-1 py-2 pr-2">
		{@render children?.()}
	</main>
</Sidebar.Provider>

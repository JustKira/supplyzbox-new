<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import DashboardSidebar from './dashboard-sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider class="flex flex-1 bg-accent">
	<DashboardSidebar />
	<div class=" max-h-screen flex-1 py-2 pr-2">
		{@render children?.()}
	</div>
</Sidebar.Provider>

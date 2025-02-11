<script lang="ts">
	import Navbar from './navbar.svelte';

	let { children, data } = $props();
</script>

<Navbar user={data.user} />
{@render children()}

<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { checkRouteMatch } from '$lib/helpers/check-route-match';

	import Users from '~icons/ph/users';
	import Package from '~icons/ph/package';
	import PencilRuler from '~icons/ph/pencil-ruler';
	import Voucher from '~icons/ph/seal-percent';
	import HouseLine from '~icons/ph/house-line';
	import School from '~icons/ph/graduation-cap';
	import Garage from '~icons/ph/garage';

	import Button from '$lib/components/ui/button/button.svelte';
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header>
		<h1 class="px-2 pt-2 font-mono font-black uppercase text-muted-foreground">Supplyzbox</h1>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>General</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard', page.url.pathname) ||
								checkRouteMatch('/dashboard/order/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard'} {...props}>
									<HouseLine />
									<span>Home</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/user', page.url.pathname) ||
								checkRouteMatch('/dashboard/user/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/user'} {...props}>
									<Users />
									<span>Users</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/school', page.url.pathname) ||
								checkRouteMatch('/dashboard/school/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/school'} {...props}>
									<School />
									<span>Schools</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/voucher', page.url.pathname) ||
								checkRouteMatch('/dashboard/voucher/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/voucher'} {...props}>
									<Voucher />
									<span>Voucher</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Product Management</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/category', page.url.pathname) ||
								checkRouteMatch('/dashboard/category/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/category'} {...props}>
									<Package />
									<span>Categories</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/product', page.url.pathname) ||
								checkRouteMatch('/dashboard/product/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/product'} {...props}>
									<PencilRuler />
									<span>Products</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard/stock', page.url.pathname) ||
								checkRouteMatch('/dashboard/stock/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard/stock'} {...props}>
									<Garage />
									<span>Stock</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<Button variant="outline" href={'/'} {...props}>Landing Page</Button>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>

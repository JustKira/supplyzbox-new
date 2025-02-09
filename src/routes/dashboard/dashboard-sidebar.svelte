<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { checkRouteMatch } from '$lib/helpers/check-route-match';

	import Users from '~icons/ph/users';
	import Package from '~icons/ph/package';
	import PencilRuler from '~icons/ph/pencil-ruler';
	import Voucher from '~icons/ph/seal-percent';
	import HouseLine from '~icons/ph/house-line';
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header />
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>General</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/dashboard', page.url.pathname) ||
								checkRouteMatch('/dashboard/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/dashboard'} {...props}>
									<HouseLine />
									<span>Home</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/user', page.url.pathname) ||
								checkRouteMatch('/user/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/user'} {...props}>
									<Users />
									<span>Users</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/voucher', page.url.pathname) ||
								checkRouteMatch('/voucher/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/voucher'} {...props}>
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
							isActive={checkRouteMatch('/category', page.url.pathname) ||
								checkRouteMatch('/category/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/category'} {...props}>
									<Package />
									<span>Categories</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuButton
							isActive={checkRouteMatch('/product', page.url.pathname) ||
								checkRouteMatch('/product/*rest', page.url.pathname)}
						>
							{#snippet child({ props })}
								<a href={'/product'} {...props}>
									<PencilRuler />
									<span>Products</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>

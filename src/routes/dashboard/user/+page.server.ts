import { UserSurrealDBModel } from '$lib/surrealdb/models/user/model.js';
import { ssp } from 'sveltekit-search-params';

export const load = async ({ locals, url }) => {
	const userModel = new UserSurrealDBModel(locals.surreal);
	const page = ssp.number().decode(url.searchParams.get('page')) ?? 1;

	return {
		users: await userModel.getUsers(page)
	};
};

import { UserSurrealDBModel } from '$lib/surrealdb/models/user/model.js';
import { ssp } from 'sveltekit-search-params';

export const load = async (event) => {
	const userModel = new UserSurrealDBModel(event.locals.surreal);

	const status = ssp.string().decode(event.url.searchParams.get('status')) ?? 'PENDING';
	const submitted = ssp.boolean().decode(event.url.searchParams.get('submitted') ?? 'true');
	const page = ssp.number().decode(event.url.searchParams.get('page')) ?? 1;

	return {
		users: await userModel.getUsers(page)
	};
};

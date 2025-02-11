import { env } from '$env/dynamic/public';
import { UserSurrealDBModel } from '$lib/surrealdb/models/user/model.js';
import isAuthenticated from './is-authenticated.js';

export const load = async ({ locals, cookies }) => {
	const verified = await isAuthenticated(cookies, env.PUBLIC_HANKO_API_URL);

	if (!verified) {
		return { user: null };
	}

	const userModel = new UserSurrealDBModel(locals.surreal);

	const user = await userModel.getUserHankoId(verified.sub);

	return { user };
};

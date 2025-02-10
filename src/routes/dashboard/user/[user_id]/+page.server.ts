import { UserSurrealDBModel } from '$lib/surrealdb/models/user/model';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { UpdateUserSchema } from '$lib/surrealdb/models/user/schema';
import { SurrealDbError } from 'surrealdb';

export const load = async ({ request, locals, params }) => {
	const userModel = new UserSurrealDBModel(locals.surreal);

	const form = await superValidate(request, zod(UpdateUserSchema));
	const user = await userModel.getUserById(params.user_id);

	return {
		user,
		form
	};
};

export const actions = {
	'update-user': async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(UpdateUserSchema));

		const model = new UserSurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		try {
			await model.updateUser(params.user_id, form.data);
			return message(form, { text: 'User updated' });
		} catch (error) {
			if (error instanceof SurrealDbError) {
				return fail(500, form);
			}
		}
	}
};

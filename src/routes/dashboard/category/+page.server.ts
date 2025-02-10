import { CategorySurrealDBModel } from '$lib/surrealdb/models/category/model.js';
import { ssp } from 'sveltekit-search-params';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { CreateCategorySchema } from '$lib/surrealdb/models/category';
import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';
import { SurrealDbError } from 'surrealdb';

export const load = async ({ request, url, locals }) => {
	const categoryModel = new CategorySurrealDBModel(locals.surreal);
	const page = ssp.number().decode(url.searchParams.get('page')) ?? 1;
	const form = await superValidate(request, zod(CreateCategorySchema));
	return {
		categories: categoryModel.getByPage(page),
		form
	};
};

export const actions = {
	'add-category': async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(CreateCategorySchema));

		const model = new CategorySurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		try {
			await model.create(form.data);
			return message(form, { text: 'Category created' });
		} catch {
			return fail(500, form);
		}
	}
};

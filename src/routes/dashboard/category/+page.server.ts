import { CategorySurrealDBModel } from '$lib/surrealdb/models/category/model.js';
import { ssp } from 'sveltekit-search-params';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	CreateCategorySchema,
	UpdateCategorySchema,
	DeleteCategorySchema
} from '$lib/surrealdb/models/category';
import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';
import { SurrealDbError } from 'surrealdb';

export const load = async ({ request, url, locals }) => {
	const categoryModel = new CategorySurrealDBModel(locals.surreal);
	const page = ssp.number().decode(url.searchParams.get('page')) ?? 1;

	const createForm = await superValidate(request, zod(CreateCategorySchema));
	const updateForm = await superValidate(request, zod(UpdateCategorySchema));
	const deleteForm = await superValidate(request, zod(DeleteCategorySchema));

	const categories = await categoryModel.getByPage(page);

	const triggerUpdate = Math.random().toString(36).substring(7);

	return {
		categories,
		createForm,
		updateForm,
		deleteForm,
		triggerUpdate
	};
};

export const actions = {
	add: async ({ request, locals, params }) => {
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
	},
	update: async ({ request, locals }) => {
		const form = await superValidate(request, zod(UpdateCategorySchema));

		const model = new CategorySurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		const { id, ...rest } = form.data;
		try {
			await model.update(id, rest);
			return message(form, { text: 'Category updated' });
		} catch (error) {
			if (error instanceof SurrealDbError) {
				return fail(404, form);
			}
			return fail(500, form);
		}
	},
	delete: async ({ request, locals }) => {
		const form = await superValidate(request, zod(DeleteCategorySchema));

		const model = new CategorySurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		try {
			await model.delete(form.data.id);
			return message(form, { text: 'Category deleted' });
		} catch (error) {
			if (error instanceof SurrealDbError) {
				return fail(404, form);
			}
			return fail(500, form);
		}
	}
};

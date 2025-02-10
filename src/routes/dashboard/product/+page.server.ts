import { CategorySurrealDBModel } from '$lib/surrealdb/models/category/model.js';
import { ssp } from 'sveltekit-search-params';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

import { CreateProductSchema, ProductSurrealDBModel } from '$lib/surrealdb/models/product';
import { RecordId } from 'surrealdb';

export const load = async ({ request, url, locals }) => {
	const categoryModel = new CategorySurrealDBModel(locals.surreal);
	const productModel = new ProductSurrealDBModel(locals.surreal);

	const page = ssp.number().decode(url.searchParams.get('page')) ?? 1;
	const search = ssp.string().decode(url.searchParams.get('search'));
	const category = ssp.string().decode(url.searchParams.get('category'));

	const form = await superValidate(request, zod(CreateProductSchema.omit({ category: true })));

	const categories = await categoryModel.getAll();
	const products =
		search && category
			? await productModel.getTextSearchWithPagination(search, category, page)
			: await productModel.getByPage(category, page);

	return {
		categories,
		products,
		form
	};
};

export const actions = {
	'add-product': async ({ request, locals, url }) => {
		const form = await superValidate(request, zod(CreateProductSchema.omit({ category: true })));

		const category = ssp.string().decode(url.searchParams.get('category'));

		const model = new ProductSurrealDBModel(locals.surreal);

		if (!form.valid || !category) {
			return fail(400, form);
		}

		console.log(new RecordId('category', category).toString());
		try {
			await model.create({ ...form.data, category: new RecordId('category', category) });
			return message(form, { text: 'Product created' });
		} catch {
			return fail(500, form);
		}
	}
};

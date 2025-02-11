import { CategorySurrealDBModel } from '$lib/surrealdb/models/category/model.js';
import { ssp } from 'sveltekit-search-params';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

import {
	CreateProductVariantSchema,
	ProductVariantSurrealDBModel
} from '$lib/surrealdb/models/variant';
import { RecordId } from 'surrealdb';

export const load = async ({ request, url, locals, params }) => {
	const productVariantModel = new ProductVariantSurrealDBModel(locals.surreal);

	const search = ssp.string().decode(url.searchParams.get('search'));

	const product = params.product_Id;
	const form = await superValidate(request, zod(CreateProductVariantSchema));

	const variants = await productVariantModel.getAll();

	return {
		variants,
		form
	};
};

export const actions = {
	'add-variant': async ({ request, locals, url, params }) => {
		const form = await superValidate(request, zod(CreateProductVariantSchema));

		const model = new ProductVariantSurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		const { image, ...rest } = form.data;

		const fileBuffer = await image.arrayBuffer();
		const filePath = `products/${form.data.name}/${form.data.image.name}`;
		try {
			await locals.minio.putObject(
				'public',
				filePath,
				Buffer.from(fileBuffer),
				Buffer.from(fileBuffer).length,
				{
					'Content-Type': image.type
				}
			);
		} catch (error) {
			console.error('Error uploading image', error);
			return fail(500, form);
		}
		const productId = params.product_Id;

		try {
			await model.create({ ...rest, image: `public/${filePath}` }, productId);
			return message(form, { text: 'Variant created' });
		} catch {
			return fail(500, form);
		}
	}
};

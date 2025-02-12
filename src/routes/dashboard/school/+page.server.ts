import { SchoolSurrealDBModel } from '$lib/surrealdb/models/school/model.js';
import { ssp } from 'sveltekit-search-params';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	CreateSchoolSchema,
	UpdateSchoolSchema,
	DeleteSchoolSchema
} from '$lib/surrealdb/models/school';
import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';
import { SurrealDbError } from 'surrealdb';
import { snakeCase } from 'change-case';

export const load = async ({ request, url, locals }) => {
	const SchoolModel = new SchoolSurrealDBModel(locals.surreal);
	const page = ssp.number().decode(url.searchParams.get('page')) ?? 1;

	const createForm = await superValidate(request, zod(CreateSchoolSchema));
	const updateForm = await superValidate(request, zod(UpdateSchoolSchema));
	const deleteForm = await superValidate(request, zod(DeleteSchoolSchema));

	const schools = await SchoolModel.getByPageWithGrades(page);

	const triggerUpdate = Math.random().toString(36).substring(7);

	return {
		schools,
		createForm,
		updateForm,
		deleteForm,
		triggerUpdate
	};
};

export const actions = {
	add: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(CreateSchoolSchema));

		const model = new SchoolSurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		const { image, ...rest } = form.data;

		const fileBuffer = await image.arrayBuffer();
		const filePath = `schools/${snakeCase(form.data.name)}/${snakeCase(form.data.image.name)}`;
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

		try {
			await model.create({ ...rest, image: `public/${filePath}` });
			return message(form, { text: 'School created' });
		} catch {
			return fail(500, form);
		}
	},
	update: async ({ request, locals }) => {
		const form = await superValidate(request, zod(UpdateSchoolSchema));

		const model = new SchoolSurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		try {
			await model.update(form.data);
			return message(form, { text: 'School updated' });
		} catch (error) {
			if (error instanceof SurrealDbError) {
				return fail(404, form);
			}
			return fail(500, form);
		}
	},
	delete: async ({ request, locals }) => {
		const form = await superValidate(request, zod(DeleteSchoolSchema));

		const model = new SchoolSurrealDBModel(locals.surreal);

		if (!form.valid) {
			return fail(400, form);
		}

		try {
			await model.delete(form.data.id);
			return message(form, { text: 'School deleted' });
		} catch (error) {
			if (error instanceof SurrealDbError) {
				return fail(404, form);
			}
			return fail(500, form);
		}
	}
};

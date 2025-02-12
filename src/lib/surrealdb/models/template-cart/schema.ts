import { object, z } from 'zod';

const TemplateCartSchema = z.object({
	id: z.string().ulid(),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string()
		})
	)
});

export const CreateTemplateCartSchema = TemplateCartSchema.omit({
	id: true
});

export const AddProductToTemplateCartSchema = z.object({
	id: z.string().ulid(),
	batches: z.array(
		object({
			category_id: z.string().ulid(),
			product_id: z.array(z.string().ulid())
		})
	)
});

export type TemplateCart = z.infer<typeof TemplateCartSchema>;

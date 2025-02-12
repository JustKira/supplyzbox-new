import { z } from 'zod';

export const ProductVariantSchema = z.object({
	id: z.string().ulid(),
	name: z.string().nonempty().min(3),
	image: z.string(),
	stock: z.number().int().positive(),
	price: z.number().int().positive()
});

export const CreateProductVariantSchema = ProductVariantSchema.omit({
	image: true,
	id: true
}).extend({
	image: z.instanceof(File, { message: 'Please upload a file.' })
});

export const UpdateProductVariantSchema = z.object({
	id: z.string().ulid(),
	name: z.string().optional(),
	stock: z.number().int().positive().optional(),
	price: z.number().int().positive().optional()
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

import { z } from 'zod';

const ProductVariantSchema = z.object({
	id: z.string().ulid(),
	name: z.string().nonempty().min(3),
	image: z.string().optional(),
	stock: z.number().int().positive(),
	price: z.number().int().positive()
});

export const CreateProductVariantSchema = ProductVariantSchema.omit({
	image: true,
	id: true
}).extend({
	image: z.instanceof(File, { message: 'Please upload a file.' })
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

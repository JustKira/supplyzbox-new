import { z } from 'zod';

const ProductSchema = z.object({
	id: z.string().ulid(),
	name: z.string().nonempty().min(3),
	category: z.string().ulid()
});

export const CreateProductSchema = ProductSchema.pick({
	name: true,
	category: true
});

export const UpdateProductSchema = z.object({
	name: z.string().optional(),
	category: z.string().optional()
});

export type Product = z.infer<typeof ProductSchema>;

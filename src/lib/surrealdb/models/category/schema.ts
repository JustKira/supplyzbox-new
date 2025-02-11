import { z } from 'zod';

const CategorySchema = z.object({
	id: z.string().ulid(),
	name: z.string().nonempty().min(3)
});

export const CreateCategorySchema = CategorySchema.pick({
	name: true
});

export const UpdateCategorySchema = z.object({
	id: z.string().ulid(),
	name: z.string()
});

export const DeleteCategorySchema = z.object({
	id: z.string().ulid()
});

export type Category = z.infer<typeof CategorySchema>;

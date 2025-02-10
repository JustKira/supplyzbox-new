import { z } from 'zod';

const CategorySchema = z.object({
	id: z.string().ulid(),
	name: z.string().nonempty().min(3)
});

export const CreateCategorySchema = CategorySchema.pick({
	name: true
});

export const UpdateCategorySchema = z.object({
	name: z.string().optional()
});

export type Category = z.infer<typeof CategorySchema>;

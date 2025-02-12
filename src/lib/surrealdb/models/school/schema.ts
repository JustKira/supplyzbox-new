import { z } from 'zod';

const SchoolSchema = z.object({
	id: z.string().ulid(),
	name: z.string().min(2),
	image: z.string()
});

export const CreateSchoolSchema = SchoolSchema.omit({
	image: true,
	id: true
}).extend({
	image: z.instanceof(File, { message: 'Please upload a file.' }),
	grades: z.array(
		z.object({
			name: z.string().min(2)
		})
	)
});

export const UpdateSchoolSchema = z.object({
	id: z.string().ulid(),
	name: z.string(),
	grades_to_update: z.array(
		z.object({
			id: z.string().ulid(),
			name: z.string().min(2)
		})
	),
	grades_to_add: z.array(z.string()),
	grades_to_remove: z.array(z.string().ulid())
});

export const DeleteSchoolSchema = z.object({
	id: z.string().ulid()
});

export const IncludedCart = z.object({
	id: z.string().ulid(),
	out: z.string().ulid(),
	in: z.string().ulid(),
	name: z.string()
});

export type IncludedCart = z.infer<typeof IncludedCart>;
export type School = z.infer<typeof SchoolSchema>;

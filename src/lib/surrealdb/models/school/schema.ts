import { z } from 'zod';

const SchoolSchema = z.object({
	id: z.string(),
	name: z.string()
});

const GradeSchema = z.object({
	in: z.string().ulid(),
	id: z.string().ulid(),
	out: z.string().ulid(),
	name: z.string()
});

export { SchoolSchema, GradeSchema };
import { z } from 'zod';

// Base schema with common fields
const UserSchema = z.object({
	id: z.string().ulid(),
	hanko_id: z.string().uuid(),
	email: z.string().email(),
	role: z.enum(['USER', 'ADMIN']).default('USER'),
	phone_number: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional()
});

export const CreateUserSchema = UserSchema.pick({
	hanko_id: true,
	email: true
});

export const UpdateUserSchema = z.object({
	email: z.string().email().optional(),
	role: z.enum(['USER', 'ADMIN']).default('USER').optional(),
	phone_number: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional()
});

// Inferred types
export type User = z.infer<typeof UserSchema>;

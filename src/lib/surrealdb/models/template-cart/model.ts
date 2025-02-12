import type Surreal from 'surrealdb';
import type { AddProductToTemplateCartSchema, CreateTemplateCartSchema } from './schema';
import { RecordId } from 'surrealdb';
import type { z } from 'zod';

export class TemplateCartSurrealDBModel {
	constructor(private surreal: Surreal) {}

	async update(id: string, data: z.infer<typeof CreateTemplateCartSchema>) {
		try {
			await this.surreal.merge(new RecordId('template_cart', id), data);
		} catch (error) {
			console.error('Error creating Template', error);
			throw new Error('Error creating Template');
		}
	}

	async addProduct(data: z.infer<typeof AddProductToTemplateCartSchema>) {}

	async delete(id: string) {
		try {
			return await this.surreal.delete(new RecordId('template_cart', id));
		} catch (error) {
			console.error('Error deleting Template Cart', error);
			throw new Error('Error deleting Template Cart');
		}
	}
}

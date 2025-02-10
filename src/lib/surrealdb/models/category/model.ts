import type Surreal from 'surrealdb';
import type { Category, CreateCategorySchema } from './schema';
import { jsonify, RecordId } from 'surrealdb';
import { ulid } from 'ulid';
import type { z } from 'zod';

export class CategorySurrealDBModel {
	constructor(private surreal: Surreal) {}

	async create(data: z.infer<typeof CreateCategorySchema>) {
		try {
			return await this.surreal.create(new RecordId('category', ulid()), data);
		} catch (error) {
			console.error('Error creating category', error);
			throw new Error('Error creating category');
		}
	}

	async getAll(): Promise<{ result: Category[] }> {
		const [result] = await this.surreal.query<[Category[]]>(`SELECT * FROM category`);
		return jsonify({ result });
	}

	async getByPage(
		page: number = 0,
		limit: number = 15
	): Promise<{ result: Category[]; count: number }> {
		let [result, count] = await this.surreal.query<[Category[], { count: number }]>(
			`
                BEGIN TRANSACTION;
    
                SELECT * FROM category ORDER BY id DESC LIMIT $limit START $start;
                SELECT count() FROM ONLY category GROUP BY count LIMIT 1;
    
                COMMIT TRANSACTION;
                `,
			{
				limit,
				start: Math.max(0, page - 1) * limit
			}
		);

		return jsonify({ result, count: count?.count || 0 });
	}
}

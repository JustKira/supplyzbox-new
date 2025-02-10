import type Surreal from 'surrealdb';
import type { CreateProductSchema, Product } from './schema';
import { jsonify, RecordId } from 'surrealdb';
import type { z } from 'zod';
import { ulid } from 'ulid';

export class ProductSurrealDBModel {
	constructor(private surreal: Surreal) {}

	async create(data: z.infer<typeof CreateProductSchema>) {
		try {
			return await this.surreal.create(new RecordId('product', ulid()), data);
		} catch (error) {
			console.error('Error creating product', error);
			throw new Error('Error creating product');
		}
	}

	async getAll() {
		const [result] = await this.surreal.query<Product[]>(`SELECT * FROM product`);
		return jsonify(result);
	}

	async getFuzzyWithPagination(
		search: string,
		category: string,
		page: number = 0,
		limit: number = 15
	): Promise<{
		result: Product[];
		count: number;
	}> {
		let [result, count] = await this.surreal.query<[Product[], { count: number }]>(
			`
				BEGIN TRANSACTION;
	
				SELECT *, string::similarity::fuzzy(name,$search) as fuzzy_score FROM product WHERE category=$category ORDER BY fuzzy_score DESC LIMIT $limit START $start;
				SELECT count() FROM ONLY product WHERE category=$category GROUP BY count LIMIT 1;
	
				COMMIT TRANSACTION;
				`,
			{
				search,
				limit,
				category: new RecordId('category', category),
				start: Math.max(0, page - 1) * limit
			}
		);
		return jsonify({ result, count: count?.count || 0 });
	}

	async getTextSearchWithPagination(
		search: string,
		category: string,
		page: number = 0,
		limit: number = 15
	): Promise<{
		result: Product[];
		count: number;
	}> {
		let [result, count] = await this.surreal.query<[Product[], { count: number }]>(
			`
				BEGIN TRANSACTION;
	
				SELECT *, search::score(1) AS score FROM product WHERE name@1@$search OR name=$search AND category=$category ORDER BY score DESC LIMIT $limit START $start;
				SELECT count() FROM ONLY product WHERE name@1@$search OR name=$search AND category=$category GROUP BY count LIMIT 1;
	
				COMMIT TRANSACTION;
				`,
			{
				search,
				limit,
				category: new RecordId('category', category),
				start: Math.max(0, page - 1) * limit
			}
		);
		return jsonify({ result, count: count?.count || 0 });
	}

	async getByPage(
		category?: string | null,
		page: number = 0,
		limit: number = 15
	): Promise<{
		result: Product[];
		count: number;
	}> {
		if (!category) {
			return { result: [], count: 0 };
		}
		let [result, count] = await this.surreal.query<[Product[], { count: number }]>(
			`
				BEGIN TRANSACTION;
	
				SELECT * FROM product WHERE category=$category ORDER BY id DESC LIMIT $limit START $start;
				SELECT count() FROM ONLY product WHERE category=$category GROUP BY count LIMIT 1;
	
				COMMIT TRANSACTION;
				`,
			{
				category: new RecordId('category', category),
				limit,
				start: Math.max(0, page - 1) * limit
			}
		);

		return jsonify({ result, count: count?.count || 0 });
	}
}

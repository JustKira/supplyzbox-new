import type Surreal from 'surrealdb';
import type { CreateProductVariantSchema, ProductVariant } from './schema';
import { jsonify, RecordId } from 'surrealdb';
import type { z } from 'zod';
import { ulid } from 'ulid';

export class ProductVariantSurrealDBModel {
	constructor(private surreal: Surreal) {}

	async create(
		data: Omit<z.infer<typeof CreateProductVariantSchema>, 'image'> & { image: string },
		productId: string
	) {
		try {
			await this.surreal.query(
				`
			BEGIN TRANSACTION;
			
			LET $variant_id = (CREATE ONLY variant:ulid() SET name=$name, image=$image, stock=$stock, price=$price).id;
			RELATE $variant_id->variant_to:ulid()->$product_id;

			COMMIT TRANSACTION;
			`,
				{ ...data, product_id: new RecordId('product', productId) }
			);
		} catch (error) {
			console.error('Error creating product', error);
			throw new Error('Error creating product');
		}
	}

	async getAll() {
		const [result] = await this.surreal.query<[ProductVariant[]]>(`SELECT * FROM variant`);
		return jsonify(result);
	}

	async getAllByProduct(product: string) {
		const [result] = await this.surreal.query<[ProductVariant[]]>(
			`SELECT * FROM variant WHERE ->variant_to->(product WHERE id= $product)`,
			{
				product: new RecordId('product', product)
			}
		);
		return jsonify(result);
	}

	async getFuzzyWithPagination(
		search: string,
		product: string,
		page: number = 0,
		limit: number = 15
	): Promise<{
		result: ProductVariant[];
		count: number;
	}> {
		let [result, count] = await this.surreal.query<[ProductVariant[], { count: number }]>(
			`
				BEGIN TRANSACTION;
	
				SELECT *, string::similarity::fuzzy(name,$search) as fuzzy_score FROM product_variant WHERE ->variant_to->(product WHERE id= $product) ORDER BY fuzzy_score DESC LIMIT $limit START $start;
				SELECT count() FROM ONLY product_variant WHERE ->variant_to->(product WHERE id= $product) GROUP BY count LIMIT 1;
	
				COMMIT TRANSACTION;
				`,
			{
				search,
				limit,
				product: new RecordId('product', product),
				start: Math.max(0, page - 1) * limit
			}
		);
		return jsonify({ result, count: count?.count || 0 });
	}
}

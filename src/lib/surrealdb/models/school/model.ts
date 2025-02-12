import type Surreal from 'surrealdb';
import type { School, CreateSchoolSchema, IncludedCart, UpdateSchoolSchema } from './schema';
import { jsonify, RecordId, StringRecordId } from 'surrealdb';
import { ulid } from 'ulid';
import type { z } from 'zod';

export class SchoolSurrealDBModel {
	constructor(private surreal: Surreal) {}

	async create(data: Omit<z.infer<typeof CreateSchoolSchema>, 'image'> & { image: string }) {
		console.log(data);
		try {
			const { grades, ...rest } = data;
			const [id] = await this.surreal.query<[string]>(
				`
					RETURN (CREATE ONLY school:ulid() SET name=$name, image=$image).id;
				`,
				rest
			);

			await this.surreal.query(
				`
				INSERT RELATION INTO included_cart $grades.map(|$grade| 
				{
					id: rand::ulid(), 
					out: (CREATE ONLY template_cart:ulid() SET categories={}).id,
					in: ${new StringRecordId(id)},
					name: $grade.name,
				});
				`,
				{
					grades
				}
			);
		} catch (error) {
			console.error('Error creating school', error);
			throw new Error('Error creating school');
		}
	}

	async update(data: z.infer<typeof UpdateSchoolSchema>) {
		try {
			return await this.surreal.query(
				`
				BEGIN TRANSACTION;

				UPDATE ${new RecordId('school', data.id)} SET name=$name;

				$grades_to_update.map(|$grade| 
				{
					UPDATE $grade.id SET name=$grade.name;
				});

				$grades_to_remove.map(|$grade_id|
				{
					DELETE (SELECT out FROM ONLY $grade_id).out; 
				});

				INSERT RELATION INTO included_cart $grades_to_add.map(|$grade| 
				{
					id: rand::ulid(), 
					out: (CREATE ONLY template_cart:ulid() SET categories={}).id,
					in: $grade.school_id,
					name: $grade.name,
				});

				COMMIT TRANSACTION;
				`,
				{
					...data,
					grades_to_update: data.grades_to_update.map((grade) => {
						return {
							id: new RecordId('included_cart', grade.id),
							name: grade.name
						};
					}),
					grades_to_remove: data.grades_to_remove.map((grade) => {
						return new RecordId('included_cart', grade);
					}),
					grades_to_add: data.grades_to_add.map((name) => {
						return {
							name,
							school_id: new RecordId('school', data.id)
						};
					})
				}
			);
			// return await this.surreal.merge(new RecordId('school', id), data);
		} catch (error) {
			console.error('Error updating school', error);
			throw new Error('Error updating school');
		}
	}

	async delete(id: string) {
		try {
			return await this.surreal.query(
				`
				BEGIN TRANSACTION;

				LET $carts = (SELECT ->included_cart.* AS carts FROM ONLY $school_id).carts;

				$carts.map(|$cart| {
					DELETE $cart.out
				});

				DELETE $school_id;

				COMMIT TRANSACTION;
				`,
				{ school_id: new RecordId('school', id) }
			);
		} catch (error) {
			console.error('Error deleting school', error);
			throw new Error('Error deleting school');
		}
	}

	async getByPage(
		page: number = 0,
		limit: number = 15
	): Promise<{ result: School[]; count: number }> {
		// SurrealDB transactions to get a page of “school” records
		let [result, count] = await this.surreal.query<[School[], { count: number }]>(
			`
                BEGIN TRANSACTION;
    
                SELECT * FROM school ORDER BY id DESC LIMIT $limit START $start;
                SELECT count() FROM ONLY school GROUP BY count LIMIT 1;
    
                COMMIT TRANSACTION;
            `,
			{
				limit,
				start: Math.max(0, page - 1) * limit
			}
		);

		return jsonify({ result, count: count?.count || 0 });
	}

	async getByPageWithGrades(
		page: number = 0,
		limit: number = 15
	): Promise<{
		result: Array<School & { grades: IncludedCart[] }>;
		count: number;
	}> {
		// SurrealDB transactions to get a page of “school” records
		let [result, count] = await this.surreal.query<
			[
				Array<
					School & {
						grades: IncludedCart[];
					}
				>,
				{ count: number }
			]
		>(
			`
                BEGIN TRANSACTION;
    
                SELECT *, ->included_cart.* as grades FROM school ORDER BY id DESC LIMIT $limit START $start;
                SELECT count() FROM ONLY school GROUP BY count LIMIT 1;
    
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

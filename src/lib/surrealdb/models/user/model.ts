import type Surreal from 'surrealdb';
import type { User } from './schema';
import { jsonify, RecordId } from 'surrealdb';

export class UserSurrealDBModel {
	constructor(private surreal: Surreal) {}

	async create({ hanko_id, email }: { hanko_id: string; email: string }) {
		try {
			return await this.surreal.query('CREATE user:ulid() SET hanko_id=$hanko_id,email=$email', {
				hanko_id,
				email
			});
		} catch (error) {
			console.error('Error creating user', error);
			throw new Error('Error creating user');
		}
	}

	async updateUser(id: string, data: Partial<Omit<User, 'id'>>) {
		try {
			return await this.surreal.merge(new RecordId('user', id), {
				...data
			});
		} catch (error) {
			console.error('Error updating user', error);
			throw new Error('Error updating user');
		}
	}

	async getUserById(id: string) {
		const [result] = await this.surreal.query<User[]>(`SELECT * FROM ONLY $id LIMIT 1`, {
			id: new RecordId('user', id)
		});
		return jsonify(result);
	}

	async getUsers(page: number = 0, limit: number = 15) {
		let [result, count] = await this.surreal.query<[User[], { count: number }]>(
			`
			BEGIN TRANSACTION;

			SELECT * FROM user ORDER BY id DESC LIMIT $limit START $start;
			SELECT count() FROM ONLY user GROUP BY count LIMIT 1;

			COMMIT TRANSACTION;
			`,
			{
				limit,
				start: Math.max(0, page - 1) * limit
			}
		);

		return jsonify({ result, count: count?.count || 0 });
	}

	async getUsersByEmail(page: number = 0, limit: number = 15, email: string) {
		let [result, count] = await this.surreal.query<[User[], { count: number }]>(
			`
            BEGIN TRANSACTION;

            SELECT * FROM user WHERE email = $email ORDER BY id DESC LIMIT $limit START $start;
            SELECT count() FROM ONLY user WHERE email = $email GROUP BY count LIMIT 1;

            COMMIT TRANSACTION;
            `,
			{
				limit,
				start: Math.max(0, page - 1) * limit,
				email
			}
		);

		return { result: jsonify(result), count: count.count };
	}

	async getUsersByPhone(page: number = 0, limit: number = 15, phone_number: string) {
		let [result, count] = await this.surreal.query<[User[], { count: number }]>(
			`
            BEGIN TRANSACTION;

            SELECT * FROM user WHERE phone_number = $phone_number ORDER BY id DESC LIMIT $limit START $start;
            SELECT count() FROM ONLY user WHERE phone_number = $phone_number GROUP BY count LIMIT 1;

            COMMIT TRANSACTION;
            `,
			{
				limit,
				start: Math.max(0, page - 1) * limit,
				phone_number
			}
		);

		return { result: jsonify(result), count: count.count };
	}
}

import type { RequestHandler } from '@sveltejs/kit';
import * as jose from 'jose';
import { z } from 'zod';

const userCreateRequestSchema = z.object({
	token: z.string(),
	event: z.literal('user.create')
});

const getUserInfo = async (token: string) => {
	try {
		const userData = jose.decodeJwt(token) as {
			data: {
				id: string;
				emails: { address: string; is_verified: true; is_primary: true }[];
				identities: { provider_name: string; provider_id: string }[];
			};
		};

		return userData;
	} catch (error) {
		console.error('Error verifying token', error);
		throw new Error('Error verifying token');
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();

	try {
		const { token } = userCreateRequestSchema.parse(data);

		const {
			data: { id, emails, identities }
		} = await getUserInfo(token);

		try {
			await locals.surreal.query('CREATE user:ulid() SET hanko_id=$hanko_id,email=$email', {
				hanko_id: id,
				email: emails[0].address
			});
		} catch (error) {
			console.error('Error creating user', error);

			return new Response('Error creating user', {
				status: 500
			});
		}
	} catch (error) {
		return new Response('Invalid request', {
			status: 400
		});
	}

	return new Response('ok', {
		status: 200
	});
};

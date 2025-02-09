import { remember } from '@epic-web/remember';
import Surreal from 'surrealdb';

import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';

export const surreal = remember('surreal', async () => {
	console.log('[LOADING] Connecting to Surreal');

	const client = new Surreal();
	await client.connect(publicEnv.PUBLIC_SURREAL_URL);

	console.log(
		'[LOADING] Signing in to Surreal',
		env.PRIVATE_SURREAL_USER,
		env.PRIVATE_SURREAL_PASS
	);
	await client.signin({
		username: env.PRIVATE_SURREAL_USER,
		password: env.PRIVATE_SURREAL_PASS
	});
	await client.use({ namespace: 'supplyzbox', database: 'public' });

	console.log('[SUCCESS] Connecting to Surreal');

	return client;
});

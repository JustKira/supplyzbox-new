import { remember } from '@epic-web/remember';
import Surreal from 'surrealdb';

import { env as publicEnv } from '$env/dynamic/public';

import { read } from '$app/server';
import { migrations } from './migrations/migrations';

export const surreal = remember('surreal', async () => {
	console.log('[LOADING] Connecting to Surreal');

	const client = new Surreal();
	await client.connect(publicEnv.PUBLIC_SURREAL_URL);

	await client.use({ namespace: 'supplyzbox', database: 'public' });

	let i = 0;
	for (const migration of migrations) {
		console.log(`[LOADING] Running migration [ID: ${i}]`);
		await client.query(migration);
		console.log(`[SUCCESS] Migration [ID: ${i}] ran successfully`);
		i++;
	}

	console.log('[SUCCESS] Surreal client created');

	return client;
});

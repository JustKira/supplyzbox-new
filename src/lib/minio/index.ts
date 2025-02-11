import { remember } from '@epic-web/remember';
import { env } from '$env/dynamic/private';
import { Client } from 'minio';

export const storage = remember('Minio', async () => {
	console.log('[LOADING] Connecting to Minio');
	const client = new Client({
		endPoint: env.PRIVATE_MINIO_ENDPOINT,
		port: Number(env.PRIVATE_MINIO_PORT),
		useSSL: env.PRIVATE_MINIO_USE_SSL === 'true',
		accessKey: env.PRIVATE_MINIO_ACCESS_KEY,
		secretKey: env.PRIVATE_MINIO_SECRET_KEY
	});

	if (!(await client.bucketExists('public'))) {
		await createBucket('public', ['products'], client);
	}

	console.log('[SUCCESS] Minio client created');
	return client;
});

const createBucket = async (bucketName: string, paths: string[], client: Client) => {
	await client.makeBucket(bucketName);

	const resources = paths.map((path) => `arn:aws:s3:::${bucketName}/${path}/*`);

	await client.setBucketPolicy(
		bucketName,
		JSON.stringify({
			Version: '2012-10-17',
			Statement: [
				{
					Effect: 'Allow',
					Principal: { AWS: ['*'] },
					Action: ['s3:GetObject'],
					Resource: resources
				}
			]
		})
	);
};

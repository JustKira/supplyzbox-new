import type { Cookies } from '@sveltejs/kit';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const isAuthenticated = async (cookies: Cookies, url: string): Promise<{ sub: string } | null> => {
	const hanko = cookies.get('hanko');
	const JWKS = createRemoteJWKSet(new URL(`${url}/.well-known/jwks.json`));

	try {
		const { payload } = await jwtVerify(hanko ?? '', JWKS);

		return payload as { sub: string };
	} catch {
		return null;
	}
};

export default isAuthenticated;

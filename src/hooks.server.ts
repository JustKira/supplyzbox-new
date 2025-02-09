import { i18n } from '$lib/i18n';

import { type Handle, redirect, type RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { match } from 'path-to-regexp';

import { env } from '$env/dynamic/public';
import { surreal } from '$lib/surrealdb/ssr';
import { checkRouteMatch } from '$lib/helpers/check-route-match';

const handleParaglide: Handle = i18n.handle();
const hankoApiUrl = env.PUBLIC_HANKO_API_URL;

const authenticatedUser = async (event: RequestEvent) => {
	const { cookies } = event;
	const hanko = cookies.get('hanko');
	const JWKS = createRemoteJWKSet(new URL(`${hankoApiUrl}/.well-known/jwks.json`));

	try {
		await jwtVerify(hanko ?? '', JWKS);
		return true;
	} catch {
		return false;
	}
};

export const hankoHandle: Handle = async ({ event, resolve }) => {
	const verified = await authenticatedUser(event);

	let protectedRoutes =
		checkRouteMatch('/dashboard', event.url.pathname) ||
		checkRouteMatch('/profile', event.url.pathname) ||
		checkRouteMatch('/settings', event.url.pathname);

	if (protectedRoutes && !verified) {
		throw redirect(303, '/login');
	}

	if (checkRouteMatch('/login', event.url.pathname) && verified) {
		throw redirect(303, '/');
	}

	const response = await resolve(event);
	return response;
};

export const surrealdbHandle: Handle = async ({ event, resolve }) => {
	event.locals.surreal = await surreal;
	return await resolve(event);
};

export const handle = sequence(hankoHandle, surrealdbHandle, handleParaglide);

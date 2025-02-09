import { match } from 'path-to-regexp';

export function checkRouteMatch(matchUrl: string, pathname: string) {
	const matcher = match(matchUrl);
	const result = matcher(pathname);
	return result !== false;
}

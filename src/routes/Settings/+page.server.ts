import { StarlieApi } from '$lib/api/StarlieApi';

export const prerender = false;

export const load = async () => {
	try {
		const version = await StarlieApi.fetchVersion();

		return { version };
	} catch {
		return { version: { version: 'unknown' } };
	}
};

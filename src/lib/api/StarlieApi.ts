import type { VersionResponse } from '$lib/api/starlie';
import { DexrnSite } from '$lib/DexrnSite';
import { ResponseError } from '$lib/error/ResponseError';

export class StarlieApi {
	public static async fetchVersion(): Promise<VersionResponse> {
		const res = await fetch(`${DexrnSite.LOCAL_STARLIE_URL}/starlie/version`, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			throw await ResponseError.create('Failed to fetch version', res);
		}

		return (await res.json()) as VersionResponse;
	}
}

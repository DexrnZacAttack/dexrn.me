import type { Author } from '$lib/api/starlie';
import { DexrnSite } from '$lib/DexrnSite';
import { ResponseError } from '$lib/error/ResponseError';

export class AuthorsApi {
	public static async fetchManyAuthors(authors: Array<string>): Promise<Author[]> {
		let st = `${DexrnSite.LOCAL_STARLIE_URL}/authors/get?`;

		authors.forEach((author) => {
			st += `usernames=${author}&`;
		});

		const res = await fetch(st, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			throw await ResponseError.create('Failed to fetch authors', res);
		}

		return (await res.json()) as Author[];
	}
}

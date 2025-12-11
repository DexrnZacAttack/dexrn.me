import type { ApiPost, Author, FullPost } from '$lib/api/starlie';
import { AuthorsApi } from '$lib/api/AuthorsApi';
import { DexrnSite } from '$lib/DexrnSite';
import { ResponseError } from '$lib/error/ResponseError';

export class BlogApi {
	public static async fetchPosts(): Promise<ApiPost[]> {
		const res = await fetch(`${DexrnSite.LOCAL_STARLIE_URL}/blog`, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			throw await ResponseError.create('Failed to fetch posts', res);
		}

		let posts: ApiPost[] = await res.json();
		posts = posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

		return posts;
	}

	public static async fetchFullPosts(): Promise<FullPost[]> {
		const res = await fetch(`${DexrnSite.LOCAL_STARLIE_URL}/blog`, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			throw await ResponseError.create('Failed to fetch posts', res);
		}

		let posts: ApiPost[] = await res.json();
		posts = posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

		const fullPosts: FullPost[] = [];
		for (const post of posts) {
			const authors: Author[] = await AuthorsApi.fetchManyAuthors(post.authors);
			fullPosts.push({
				...post,
				authors
			});
		}

		return fullPosts;
	}

	public static async fetchPost(id: string): Promise<ApiPost> {
		const res = await fetch(`${DexrnSite.LOCAL_STARLIE_URL}/blog/post/` + id, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			if (res.status === 404) {
				throw await ResponseError.create('Post does not exist', res);
			}
			throw await ResponseError.create('Failed to get post', res);
		}

		return (await res.json()) as ApiPost;
	}
}

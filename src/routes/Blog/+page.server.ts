import { BlogApi } from '$lib/api/BlogApi';
import { ResponseError } from '$lib/error/ResponseError';

export const load = async () => {
	try {
		const posts = await BlogApi.fetchFullPosts();

		return { posts };
	} catch (ex: unknown) {
		if (ex instanceof ResponseError) {
			return { error: (ex as ResponseError).toJSON() };
		}

		if (ex instanceof Error) {
			return { error: { name: ex.name, message: ex.message, response: '', code: 500 } };
		}
	}
};

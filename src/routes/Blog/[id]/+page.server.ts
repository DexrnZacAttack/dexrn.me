import { BlogApi } from '$lib/api/BlogApi';
import { ResponseError } from '$lib/error/ResponseError';
import { error } from '@sveltejs/kit';
import { parse } from 'marked';

export const prerender = false;

export const load = async ({ params }: { params: Record<string, string> }) => {
	const title = params.id;

	let post;
	try {
		post = await BlogApi.fetchPost(title);
	} catch (e) {
		const ee = e as ResponseError;
		throw error(ee.code, ee.message);
	}

	if (!post) {
		throw error(404, `Post not found: ${title}`);
	}

	const body = parse(post.content || '');

	return {
		post,
		body
	};
};

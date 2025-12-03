import { loadPostByTitle } from '$lib/blog';
import { error } from '@sveltejs/kit';
import { parse } from 'marked';

export const prerender = false;

export const load = async ({ params }: { params: Record<string, string> }) => {
	const title = params.id;

	let post;
	try {
		post = await loadPostByTitle(title);
	} catch (e) {
		throw error(404, `Post not found: ${title}`);
	}

	if (!post) {
		throw error(404, `Post not found: ${title}`);
	}

	const body = parse(post.body || '');

	return {
		post,
		body
	};
};

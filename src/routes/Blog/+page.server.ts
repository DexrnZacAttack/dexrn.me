import { fetchPosts } from '$lib/blog';

export const load = async () => {
	return { posts: await fetchPosts() };
};

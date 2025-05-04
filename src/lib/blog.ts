/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
 */

import type { ApiResponse, Post, PostInfo } from '$lib/api';
import { DexrnSite } from './DexrnSite';

export async function fetchPosts(): Promise<PostInfo[]> {
	const res: ApiResponse<PostInfo[]> = await (
		await fetch(`${DexrnSite.BACKEND_URL}/api/v1/blog`, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		})
	).json();
	let posts = res.result;

	posts = posts.filter((i) => !i.hidden);
	posts = posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	return posts;
}

export async function loadPost(post: PostInfo): Promise<Post> {
	const res: ApiResponse<Post> = await (
		await fetch(DexrnSite.BACKEND_URL + post.postURL, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		})
	).json();

	if (!res.success) throw new Error(res.error?.message);

	return res.result;
}

export async function loadPostByTitle(title: string): Promise<Post> {
	const res: ApiResponse<Post> = await (
		await fetch(`${DexrnSite.BACKEND_URL}/api/v1/blog/get?post=` + title, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		})
	).json();

	if (!res.success) throw new Error(res.error?.message);

	return res.result;
}

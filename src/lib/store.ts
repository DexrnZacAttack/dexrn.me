import type { PostInfo } from '$lib/api';
import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';
import { writable } from 'svelte/store';

export const speed = new Tween(1, {
	duration: 500,
	easing: cubicOut
});

export const zoom = new Tween(0, {
	duration: 200,
	easing: (t) => t
});

export const lyIsOnMobile = writable(false);
export const lyIsOnDesktop = writable(false);
export const lyIsOnBrowser = writable(false);
export const lyIsOnConsole = writable(false);

export const posts = writable<PostInfo[]>([]);

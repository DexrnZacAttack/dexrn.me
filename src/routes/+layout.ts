import { browser } from '$app/environment';
import '$lib/i18n/I18N';
import { marked, Renderer, type Token } from 'marked';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const prerender = true;

const renderer = new Renderer();

renderer.heading = ({ tokens, depth }: { tokens: Token[]; depth: number }) => {
	const text = tokens.map((token) => (token.type === 'text' ? token.text : '')).join('');
	const level = depth + 1;
	if (level === 1 || level === 2) {
		return `<h${level} style="margin-bottom:0;">${text}</h${level}><hr />`;
	}
	return `<h${level}>${text}</h${level}>`;
};

marked.setOptions({
	gfm: true,
	breaks: true,
	renderer: renderer
});

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}

	await waitLocale();
};

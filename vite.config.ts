import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['dexrnzacattack.github.io'],
		fs: {
			allow: ['package.json']
		}
	}
});

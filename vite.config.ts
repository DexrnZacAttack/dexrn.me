import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		allowedHosts: ['dexrn.me', 'dev.dexrn.me'],
		fs: {
			allow: ['package.json', 'build.json']
		}
	}
});

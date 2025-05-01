import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

register('en-US', () => import('./locales/en-US.json'));

init({
	fallbackLocale: 'en-US',
	initialLocale: browser ? window.navigator.language : 'en-US'
});

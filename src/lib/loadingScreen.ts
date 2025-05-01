import { speed } from '$lib/store';
import { waitLocale } from 'svelte-i18n';
import { writable } from 'svelte/store';
import { DexrnSite } from './DexrnSite';

interface Status {
	transitioning: boolean; // whether we are currently transitioning
	bgLoading: boolean; // whether the background image has loaded in or not
	loading: boolean; // whether the page is ready to render
	loadingScreenText: string; // what the loading screen text should say
	loadingError: boolean; // whether there was an error, if so then we need to let the user escape.
}

export const status = writable<Status>({
	loading: true,
	bgLoading: true,
	transitioning: true,
	loadingScreenText: 'Loading...', // can't get this to localize without fucking everything up (using top level await)
	loadingError: false
});

async function init() {
	await waitLocale();
	status.update((current) => ({
		...current,
		loadingScreenText: DexrnSite.tr('loadingScreen.loading')
	}));
}

init();

// static class hehe
// unsure if we can move the status store into this
export class LoadingScreen {
	public static set transitionStatus(s: boolean) {
		status.update((current) => ({ ...current, transitioning: s }));
	}

	public static set loadingStatus(s: boolean) {
		status.update((current) => ({ ...current, loading: s }));
	}

	public static set bgLoadingStatus(s: boolean) {
		status.update((current) => ({ ...current, bgLoading: s }));
	}

	public static set loadingText(s: string) {
		status.update((current) => ({ ...current, loadingScreenText: s }));
	}

	public static set loadingError(s: boolean) {
		status.update((current) => ({ ...current, loadingError: s }));
	}

	public static resetLoadingScreenText() {
		status.update((current) => ({
			...current,
			loadingScreenText: DexrnSite.tr('loadingScreen.loading')
		}));
	}

	public static async setShowLoadingScreenError(b: boolean = true, s: string = 'Error') {
		if (b) {
			await speed.set(0.1);
			LoadingScreen.loadingText = s;
		}
		LoadingScreen.loadingError = b;
	}
}

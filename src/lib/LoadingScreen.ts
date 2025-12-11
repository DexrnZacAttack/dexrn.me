import { main } from '$lib/Main';
import { PanoramaBackground } from '$lib/PanoramaBackground';
import { writable } from 'svelte/store';
import { DexrnSite } from './DexrnSite';

// also our entrypoint for some reason
main();

interface Status {
	transitioning: boolean; // whether we are currently transitioning
	bgLoading: boolean; // whether the background image has loaded in or not
	loading: boolean; // whether the page is ready to render
	loadingScreenText: string; // what the loading screen text should say
	loadingError: boolean; // whether there was an error, if so then we need to let the user escape.
}

export class LoadingScreen {
	public static Instance: LoadingScreen = new LoadingScreen();

	public Status = writable<Status>({
		loading: true,
		bgLoading: true,
		transitioning: true,
		loadingScreenText: "Loading...",
		loadingError: false
	});

	private constructor() {}

	public set transitionStatus(s: boolean) {
		this.Status.update((current) => ({ ...current, transitioning: s }));
	}

	public set loadingStatus(s: boolean) {
		this.Status.update((current) => ({ ...current, loading: s }));
	}

	public set bgLoadingStatus(s: boolean) {
		this.Status.update((current) => ({ ...current, bgLoading: s }));
	}

	public set loadingText(s: string) {
		this.Status.update((current) => ({ ...current, loadingScreenText: s }));
	}

	public set loadingError(s: boolean) {
		this.Status.update((current) => ({ ...current, loadingError: s }));
	}

	public resetLoadingScreenText() {
		this.Status.update((current) => ({
			...current,
			loadingScreenText: DexrnSite.TRANSLATE('loadingScreen.loading')
		}));
	}

	public async setShowLoadingScreenError(b: boolean = true, s: string = 'Error') {
		if (b) {
			await PanoramaBackground.instance.speed.set(0.1);
			this.loadingText = s;
		}
		this.loadingError = b;
	}
}

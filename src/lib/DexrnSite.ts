import { Settings } from '$lib/Settings';
import { StylesheetConfig, StylesheetTheme } from '$lib/stylesheet/StylesheetConfig';
import { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import { version } from '../../package.json';

export enum LoadingResult {
	SUCCESS,
	BG_FAIL,
	BG_UNKNOWN_HOST
}

// Main class
export class DexrnSite {
	public static instance: DexrnSite;

	public static readonly LOCAL_STARLIE_URL = 'http://localhost:6173'; // for serverside rendering
	public static readonly STARLIE_URL = 'http://10.0.1.1:6173';
	public static readonly OUTER_ROUTES = ['/Settings'];

	public static readonly TRANSLATE = get(t);

	public readonly settings: Settings;
	private _stylesheet?: StylesheetConfig;

	public constructor() {
		DexrnSite.instance = this;
		this.settings = new Settings();
	}

	public static sleep(ms: number, force: boolean = false) {
		const canSleep = force || !DexrnSite.instance.settings?.noSleep;

		return canSleep ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
	}

	public static getVersion(): string {
		return version;
	}

	public setupStylesheet(theme: StylesheetTheme) {
		const root = document.documentElement;
		root.style.setProperty('--vh', `${window.innerHeight}px`);
		root.style.setProperty('--vw', `${window.innerWidth}px`);

		window.addEventListener('resize', () => {
			root.style.setProperty('--vh', `${window.innerHeight}px`);
			root.style.setProperty('--vw', `${window.innerWidth}px`);
		});

		if (!this._stylesheet) this._stylesheet = new StylesheetConfig(document.documentElement, theme);

		this._stylesheet.setTheme(theme);
		this._stylesheet.apply();
	}
}

export {};

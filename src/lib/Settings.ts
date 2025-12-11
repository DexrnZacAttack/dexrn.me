import { StylesheetTheme } from '$lib/stylesheet/StylesheetConfig';
import { DexrnSite } from './DexrnSite';

export class Settings {
	public zoomPercentage = 150;
	public useLightMode = false;
	public doNotScrollPanorama = false;
	public noSleep = false;

	public constructor() {
		this.load();
		this.save();
	}

	public get<T>(name: string): T | null {
		if (!(name in this)) return null;

		// @ts-expect-error Reflection
		return this[name];
	}

	public set<T>(name: string, value: T): void {
		if (!(name in this)) return;

		// @ts-expect-error Reflection
		this[name] = value;
		this.save();
	}

	private load() {
		for (const key of Object.keys(this)) {
			const stored = localStorage.getItem(key);
			if (stored === null) continue;

			const def = (this as never)[key];

			switch (typeof def) {
				case 'number':
					// @ts-expect-error
					(this as never)[key] = parseInt(stored);
					break;
				case 'boolean':
					// @ts-expect-error
					(this as never)[key] = stored === 'true';
					break;
			}
		}
		DexrnSite.instance.setupStylesheet(
			this.useLightMode ? StylesheetTheme.LIGHT : StylesheetTheme.DARK
		);
	}

	private save() {
		for (const key of Object.keys(this)) {
			localStorage.setItem(key, String((this as never)[key]));
		}
		DexrnSite.instance.setupStylesheet(
			this.useLightMode ? StylesheetTheme.LIGHT : StylesheetTheme.DARK
		);
	}
}

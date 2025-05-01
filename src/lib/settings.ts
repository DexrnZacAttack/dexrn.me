import { DexrnSite } from './DexrnSite';

export class Settings {
	public zoomPercentage = 150;
	public useLightMode = false;
	public doNotScrollPanorama = false;
	public noSleep = false;

	private load() {
		for (const key of Object.keys(this)) {
			const stored = localStorage.getItem(key);
			if (stored === null) continue;

			const def = (this as any)[key];

			switch (typeof def) {
				case 'number':
					(this as any)[key] = parseInt(stored);
					break;
				case 'boolean':
					(this as any)[key] = stored === 'true';
					break;
			}
		}
		DexrnSite.loadCss(this);
	}

	private save() {
		for (const key of Object.keys(this)) {
			localStorage.setItem(key, String((this as any)[key]));
		}
		DexrnSite.loadCss(this);
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

	public constructor() {
		this.load();
		this.save();
	}
}

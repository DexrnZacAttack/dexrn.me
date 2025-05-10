import { DiscordActivityType } from '$lib/lanyard';
import { Settings } from '$lib/settings';
import { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import { postBuild } from '../../build.json';
import { version } from '../../package.json';

// Core commons
export namespace DexrnSite {
	export function sleep(ms: number, force: boolean = false) {
		const canSleep = force || !DexrnSite?.settings?.noSleep;

		return canSleep ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
	}

	export const tr = get(t);

	export enum LoadingResult {
		SUCCESS,
		BG_FAIL,
		BG_UNKNOWN_HOST
	}

	export function getPostBuildTime(): number {
		return postBuild.timestamp;
	}

	export function getVersion(): string {
		return version;
	}

	export function getTitleFromActivityType(type: DiscordActivityType, title: string) {
		switch (type) {
			// could make this reflect but this is easier for now
			case DiscordActivityType.Playing:
				return tr('lanyard.activityType.playing', { values: { name: title } });
			case DiscordActivityType.Listening:
				return tr('lanyard.activityType.listening', { values: { name: title } });
			case DiscordActivityType.Streaming:
				return tr('lanyard.activityType.streaming', { values: { name: title } });
			case DiscordActivityType.Watching:
				return tr('lanyard.activityType.watching', { values: { name: title } });
			case DiscordActivityType.Competing:
				return tr('lanyard.activityType.competing');
			case DiscordActivityType.Custom:
			default:
				return tr('lanyard.activityType.custom');
		}
	}

	export const OUTER_ROUTES = ['/Settings'];

	// https://stackoverflow.com/questions/45205593/how-to-convert-a-json-style-object-to-a-css-string
	export function styleToString(style: Partial<CSSStyleDeclaration>): string {
		return Object.keys(style).reduce(
			(acc, key) =>
				acc +
				key
					.split(/(?=[A-Z])/)
					.join('-')
					.toLowerCase() +
				':' +
				style[key as any] +
				';',
			''
		);
	}

	export function back() {
		history.back();
	}

	export function toTimeString(ts: number): string {
		if (ts > 0) {
			const seconds = Math.floor(ts / 1000) % 60;
			const minutes = Math.floor(ts / (1000 * 60)) % 60;
			const hours = Math.floor(ts / (1000 * 60 * 60));

			return `${hours != 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		} else {
			return '';
		}
	}

	export function timeSince(now: number, time: number) {
		return DexrnSite.toTimeString(now - time);
	}

	export const BACKEND_URL = 'https://dexrn.dedyn.io';
	export let settings: Settings;

	// please tell me there is some better way to do this
	export function loadCss(settings: Settings) {
		const root = document.documentElement;
		root.style.setProperty('--vh', `${window.innerHeight}px`);
		root.style.setProperty('--vw', `${window.innerWidth}px`);

		window.addEventListener('resize', () => {
			root.style.setProperty('--vh', `${window.innerHeight}px`);
			root.style.setProperty('--vw', `${window.innerWidth}px`);
		});

		if (settings.get<boolean>('useLightMode')) {
			root.style.setProperty('--prim-bg-color', 'rgba(255, 255, 255, 0.3)');
			root.style.setProperty('--alt-bg-color', 'rgba(200, 200, 200, 0.3)');
			root.style.setProperty('--prim-inverse-bg-color', 'rgba(0, 0, 0, 0.6)');
			root.style.setProperty('--alt-inverse-bg-color', 'rgba(0, 0, 0, 0.3)');
			root.style.setProperty('--prim-control-color', 'rgba(255, 255, 255, 0.5)');
			root.style.setProperty('--prim-border-color', 'rgba(255, 255, 255, 0.2)');
			root.style.setProperty('--prim-img-border-color', 'rgba(15, 15, 15, 0.3)');
			root.style.setProperty('--alt-bg-color-2', 'rgba(150, 150, 150, 0.2)');
			root.style.setProperty('--prim-moreopaque-border-color', 'rgba(200, 200, 200, 0.5)');
			root.style.setProperty('--prim-control-border-color', 'rgba(200, 200, 200, 0.2)');
			root.style.setProperty('--prim-other-bg-color', 'rgba(255, 255, 255, 0.2)');
			root.style.setProperty('--prim-reading-bg-color', 'rgba(229, 229, 229, 1)');
			root.style.setProperty('--prim-color', 'rgba(255, 255, 255, 1)');
			root.style.setProperty('--prim-hover-color', 'rgba(0, 120, 215, 0.3)');
			root.style.setProperty('--prim-subborder-color', 'rgba(255, 255, 255, 0.212)');
			root.style.setProperty('--prim-shadow-color', 'rgba(100, 100, 100, 0.3)');
			root.style.setProperty('--alt-border-size', '4px');
			root.style.setProperty('--prim-border-size', '2px');
			root.style.setProperty('--prim-text-color', 'black');
			root.style.setProperty('--href-color', '#0c3485');
			root.style.setProperty('--href-hover-color', '#07235c');
			root.style.setProperty('--behind-background-color', '#dddddd');
		} else {
			root.style.setProperty('--prim-bg-color', 'rgba(0, 0, 0, 0.6)');
			root.style.setProperty('--alt-bg-color', 'rgba(50, 50, 50, 0.6)');
			root.style.setProperty('--prim-inverse-bg-color', 'rgba(255, 255, 255, 0.6)');
			root.style.setProperty('--alt-inverse-bg-color', 'rgba(255, 255, 255, 0.3)');
			root.style.setProperty('--alt-bg-color-2', 'rgba(0, 0, 0, 0.2)');
			root.style.setProperty('--prim-control-color', 'rgba(0, 0, 0, 0.5)');
			root.style.setProperty('--prim-border-color', 'rgba(100, 100, 100, 0.2)');
			root.style.setProperty('--prim-img-border-color', 'rgba(15, 15, 15, 0.3)');
			root.style.setProperty('--prim-moreopaque-border-color', 'rgba(100, 100, 100, 0.5)');
			root.style.setProperty('--prim-control-border-color', 'rgba(150, 150, 150, 0.2)');
			root.style.setProperty('--prim-other-bg-color', 'rgba(0, 0, 0, 0.2)');
			root.style.setProperty('--prim-reading-bg-color', 'rgba(15, 15, 15, 1)');
			root.style.setProperty('--prim-color', 'rgba(0, 0, 0, 1)');
			root.style.setProperty('--prim-hover-color', 'rgba(0, 120, 215, 0.3)');
			root.style.setProperty('--prim-subborder-color', 'rgba(255, 255, 255, 0.212)');
			root.style.setProperty('--prim-shadow-color', 'rgba(0, 0, 0, 0.6)');
			root.style.setProperty('--alt-border-size', '4px');
			root.style.setProperty('--prim-border-size', '2px');
			root.style.setProperty('--prim-text-color', 'white');
			root.style.setProperty('--href-color', '#109fff');
			root.style.setProperty('--href-hover-color', '#0b6cac');
			root.style.setProperty('--behind-background-color', '#111111');
		}
	}
}

export {};

/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of dexrn.me.
 * https://github.com/DexrnZacAttack/dexrn.me
 *
 * Licensed under the MIT License. See LICENSE file for details.
 */

import { DexrnSite } from '$lib/DexrnSite';
import { LanyardWebsocket } from '$lib/lanyard/LanyardWebsocket';
import { DiscordActivityType } from '$lib/lanyard/discord';
import { t } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import validator from 'validator';

const $t = get(t);

type WritableImage = {
	image: string;
	style: Partial<CSSStyleDeclaration>;
};

type WritableText = {
	text: string;
	style: Partial<CSSStyleDeclaration>;
};

type WritableStatus = {
	status?: string;
	emoji?: string;
	em_id?: string;
};

export class Lanyard {
	public readonly userOnMobile = writable(false);
	public readonly userOnDesktop = writable(false);
	public readonly userOnBrowser = writable(false);
	public readonly userOnEmbedded = writable(false); // consoles use this
	public readonly pfp = writable<WritableImage>({
		image: '',
		style: {
			border: '2px solid #747e8c',
			boxShadow: '0 0 20px #747e8c'
		}
	});
	public readonly customStatus = writable<WritableStatus>({
		status: '',
		emoji: ''
	});
	public readonly onlineState = writable<WritableText>({
		text: '', // TODO: this causes i18n error since locale hasn't been initialized by this point in some cases
		style: {
			color: '#747e8c',
			opacity: '1'
		}
	});
	public readonly activities = writable<Array<LanyardActivity>>();
	private _ws: LanyardWebsocket;
	private readonly _userId;

	public constructor(id: string) {
		this._userId = id;
		this._ws = new LanyardWebsocket(id);
	}

	public static avatarIsAnimated(avatar: string): boolean {
		return avatar.startsWith('a_');
	}

	public static getTitleFromActivityType(type: DiscordActivityType, title: string) {
		switch (type) {
			// could make this reflect but this is easier for now
			case DiscordActivityType.Playing:
				return DexrnSite.TRANSLATE('lanyard.activityType.playing', { values: { name: title } });
			case DiscordActivityType.Listening:
				return DexrnSite.TRANSLATE('lanyard.activityType.listening', { values: { name: title } });
			case DiscordActivityType.Streaming:
				return DexrnSite.TRANSLATE('lanyard.activityType.streaming', { values: { name: title } });
			case DiscordActivityType.Watching:
				return DexrnSite.TRANSLATE('lanyard.activityType.watching', { values: { name: title } });
			case DiscordActivityType.Competing:
				return DexrnSite.TRANSLATE('lanyard.activityType.competing');
			case DiscordActivityType.Custom:
			default:
				return DexrnSite.TRANSLATE('lanyard.activityType.custom');
		}
	}

	public static getImage(url: string, appId: string) {
		const imageLink = url.includes('external')
			? `https://media.discordapp.net/external/${url.split('mp:external/')[1]}`
			: url.startsWith('spotify:')
				? `https://i.scdn.co/image/${url.substring(8)}` // I don't use spotify
				: `https://cdn.discordapp.com/app-assets/${validator.escape(appId)}/${validator.escape(url)}.webp?quality=lossless`;

		return imageLink;
	}

	public async setAvatar(lyData: LanyardAPI): Promise<void> {
		const {
			discord_user: { avatar }
		} = lyData;

		const fullUrl = `https://cdn.discordapp.com/avatars/${this._userId}/${avatar}.webp?size=512&animated=true&quality=lossless`;
		this.pfp.update((s) => ({
			...s,
			image: fullUrl
		}));
	}

	public async setAvatarFrame(lyData: LanyardAPI): Promise<void> {
		const {
			discord_status,
			active_on_discord_mobile,
			active_on_discord_web,
			active_on_discord_desktop,
			active_on_discord_embedded
		} = lyData;

		const statusMapping = {
			online: { color: '#3ba45d', text: $t('lanyard.status.online'), isOffline: false },
			dnd: { color: '#ed4245', text: $t('lanyard.status.dnd'), isOffline: false },
			idle: { color: '#faa81a', text: $t('lanyard.status.idle'), isOffline: false },
			offline: { color: '#747e8c', text: $t('lanyard.status.offline'), isOffline: true },
			default: { color: '#747e8c', text: $t('lanyard.status.unknown'), isOffline: true }
		};

		const { color, text, isOffline } = statusMapping[discord_status] || statusMapping.default;

		if (get(this.onlineState).text !== text) {
			this.pfp.update((s) => ({
				...s,
				style: {
					border: `2px solid ${color}`,
					boxShadow: `0 0 20px ${color}`
				}
			}));

			this.onlineState.update(() => ({
				text: text,
				style: {
					color: color,
					opacity: isOffline ? '0.5' : '1'
				}
			}));
		}

		this.userOnDesktop.set(active_on_discord_desktop);
		this.userOnMobile.set(active_on_discord_mobile);
		this.userOnBrowser.set(active_on_discord_web);
		this.userOnEmbedded.set(active_on_discord_embedded);
	}

	public async setStatus(lyData: LanyardAPI): Promise<void> {
		const { discord_status, activities } = lyData;

		if (discord_status == 'offline') {
			return;
		}

		if (activities) {
			const status = activities.find(
				(m): m is LanyardActivityLike => m.type == DiscordActivityType.Custom
			);
			if (status) {
				const { state, emoji } = status;
				this.customStatus.set({ status: state, emoji: emoji?.name, em_id: emoji?.id });
			} else {
				this.customStatus.set({ status: undefined, emoji: undefined });
			}
		}
	}

	public async start() {
		this._ws.onEventReceived = (ws, data) => this.handleEvent(ws, data);
		await this._ws.start();
	}

	public stop() {
		this._ws.stop();
	}

	private async handleEvent(ws: LanyardWebsocket, data: LanyardPacket) {
		const event: LanyardAPI = data.d as LanyardAPI;

		await this.setAvatarFrame(event);
		await this.setAvatar(event);
		await this.setStatus(event);
		this.activities.set(event.activities);
	}
}

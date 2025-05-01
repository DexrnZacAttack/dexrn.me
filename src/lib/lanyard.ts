/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
 */

import { lyIsOnBrowser, lyIsOnDesktop, lyIsOnMobile } from '$lib/store';
import { t, waitLocale } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import validator from 'validator';
const $t = get(t);

enum PID {
	EventBD, // s <-> c
	HelloS2C, // s --> c
	InitC2S, // s <-- c
	HeartbeatC2S // s <-- c
}

export enum DiscordActivityType {
	Playing,
	Streaming,
	Listening,
	Watching,
	Custom,
	Competing
}

export function getImage(url: string, appId: string) {
	const imageLink = url.includes('external')
		? `https://media.discordapp.net/external/${url.split('mp:external/')[1]}`
		: `https://cdn.discordapp.com/app-assets/${validator.escape(appId)}/${validator.escape(url)}.png?quality=lossless`;

	return imageLink;
}

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
};

const USERID = '485504221781950465';
export const pfp = writable<WritableImage>({
	image: '',
	style: {
		border: '2px solid #747e8c',
		boxShadow: '0 0 20px #747e8c'
	}
});

export const customStatus = writable<WritableStatus>({
	status: '',
	emoji: ''
});

export const onlineState = writable<WritableText>({
	text: '', // TODO: this causes i18n error since locale hasn't been initialized by this point in some cases
	style: {
		color: '#747e8c',
		opacity: '1'
	}
});

export const activities = writable<Array<LanyardActivity>>();

async function setAvatar(lyData: LanyardAPI): Promise<void> {
	const {
		discord_user: { avatar }
	} = lyData;
	const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
	pfp.update((s) => ({
		...s,
		image: fullUrl
	}));
}

async function setAvatarFrame(lyData: LanyardAPI): Promise<void> {
	const {
		discord_status,
		active_on_discord_mobile,
		active_on_discord_web,
		active_on_discord_desktop
	} = lyData;

	const statusMapping = {
		online: { color: '#3ba45d', text: $t('lanyard.status.online'), isOffline: false },
		dnd: { color: '#ed4245', text: $t('lanyard.status.dnd'), isOffline: false },
		idle: { color: '#faa81a', text: $t('lanyard.status.idle'), isOffline: false },
		offline: { color: '#747e8c', text: $t('lanyard.status.offline'), isOffline: true },
		default: { color: '#747e8c', text: $t('lanyard.status.unknown'), isOffline: true }
	};

	const { color, text, isOffline } = statusMapping[discord_status] || statusMapping.default;

	if (get(onlineState).text !== text) {
		pfp.update((s) => ({
			...s,
			style: {
				border: `2px solid ${color}`,
				boxShadow: `0 0 20px ${color}`
			}
		}));

		onlineState.update(() => ({
			text: text,
			style: {
				color: color,
				opacity: isOffline ? '0.5' : '1'
			}
		}));
	}

	lyIsOnDesktop.set(active_on_discord_desktop);
	lyIsOnMobile.set(active_on_discord_mobile);
	lyIsOnBrowser.set(active_on_discord_web);
}

async function setStatus(lyData: LanyardAPI): Promise<void> {
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
			customStatus.set({ status: state, emoji: emoji?.name });
		} else {
			customStatus.set({ status: undefined, emoji: undefined });
		}
	}
}

const ws = new WebSocket('wss://api.lanyard.rest/socket');
ws.onmessage = async function (res) {
	await waitLocale();
	try {
		const packet: LanyardPacket = JSON.parse(res.data);
		switch (packet.op) {
			// relogic style
			case PID.HelloS2C: {
				ws.send(
					JSON.stringify({
						op: PID.InitC2S,
						d: { subscribe_to_id: USERID }
					})
				);

				const heartbeat = (packet.d as LanyardHelloPacket).heartbeat_interval;

				// https://lanyard.eggsy.xyz/api/working-with-websockets | Heartbeat
				setInterval(() => {
					ws.send(JSON.stringify({ op: PID.HeartbeatC2S }));
				}, heartbeat);

				break;
			}
			case PID.EventBD: {
				const event: LanyardAPI = packet.d as LanyardAPI;
				await setAvatarFrame(event);
				await setAvatar(event);
				await setStatus(event);
				activities.set(event.activities);
				break;
			}
			default:
				console.log(`RECEIVED UNKNOWN PACKET! ID: ${packet.d || 'UNKNOWN'}`);
				break;
		}
	} catch (e) {
		console.error(e);
	}
};

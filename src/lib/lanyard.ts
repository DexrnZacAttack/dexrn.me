/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of dexrn.me.
 * https://github.com/DexrnZacAttack/dexrn.me
 *
 * Licensed under the MIT License. See LICENSE file for details.
 */

import { lyIsOnBrowser, lyIsOnDesktop, lyIsOnMobile } from '$lib/store';
import { t, waitLocale } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import validator from 'validator';
const $t = get(t);

export enum UserFlags {
	STAFF = 1 << 0 /**< Is the user a Discord employee */,
	PARTNER = 1 << 1 /**< Is the user a partnered server owner */,
	HYPESQUAD = 1 << 2 /**< Is the user in HypeSquad */,
	BUG_HUNTER_LEVEL_1 = 1 << 3 /**< Is the user bug hunter lvl 1 */,
	HYPESQUAD_HOUSE_BRAVERY = 1 << 5 /**< Is the user in the HypeSquad House of Bravery */,
	HYPESQUAD_HOUSE_BRILLIANCE = 1 << 6 /**< Is the user in the HypeSquad House of Brilliance */,
	HYPESQUAD_HOUSE_BALANCE = 1 << 7 /**< Is the user in the HypeSquad House of Balance */,
	EARLY_SUPPORTER = 1 << 8 /**< Is the user an early nitro supporter */,
	TEAM_USER = 1 << 9 /**< Is the user in a developer team */,
	BUG_HUNTER_LEVEL_2 = 1 << 14 /**< Is the user bug hunter lvl 2 */,
	VERIFIED_BOT = 1 << 16 /**< Is the user a verified bot */,
	EARLY_VERIFIED_BOT_DEVELOPER = 1 << 17 /**< Is the user an early verified bot developer */,
	CERTIFIED_MODERATOR = 1 << 18 /**< Is the user in the Moderator Programs Alumni */,
	BOT_HTTP_INTERACTIONS = 1 <<
		19 /**< Whether the user only uses HTTP interactions and is shown in the online member list */,
	ACTIVE_DEVELOPER = 1 << 22 /**< Is the user an Active Developer */
}

export enum NitroType {
	NONE,
	NITRO_CLASSIC,
	NITRO,
	NITRO_BASIC
}

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
		: url.startsWith('spotify:')
			? `https://i.scdn.co/image/${url.substring(8)}` // I don't use spotify
			: `https://cdn.discordapp.com/app-assets/${validator.escape(appId)}/${validator.escape(url)}.webp?quality=lossless`;

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
	em_id?: string;
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

// tbh might be helpful to start wrapping some of these fields in classes that have helpers such as these
function avatarIsAnimated(avatar: string): boolean {
	return avatar.startsWith('a_');
}

async function setAvatar(lyData: LanyardAPI): Promise<void> {
	const {
		discord_user: { avatar }
	} = lyData;

	const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512&animated=true&quality=lossless`;
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
			customStatus.set({ status: state, emoji: emoji?.name, em_id: emoji?.id });
		} else {
			customStatus.set({ status: undefined, emoji: undefined });
		}
	}
}

if (typeof WebSocket !== 'undefined') {
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
}

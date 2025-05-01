// https://lanyard.eggsy.xyz/api/getting-user-presence
// https://discord.com/developers/docs/resources/user

declare interface DiscordAvatarDecorationData {
	asset: string;
	sku_id: string;
	expires?: number;
}

declare interface LanyardAPI {
	kv: {
		lanyardOwner: string;
	};
	spotify: {
		album_art_url: string;
		album: string;
	} | null;
	discord_user: {
		id: string;
		username: string;
		avatar: string;
		discriminator: string;
		bot: boolean;
		global_name: number;
		avatar_decoration_data?: DiscordAvatarDecorationData;
		display_name: number;
		public_flags: number;
	};
	activities: LanyardActivity[];
	discord_status: 'online' | 'dnd' | 'idle' | 'offline';
	active_on_discord_web: boolean;
	active_on_discord_desktop: boolean;
	active_on_discord_mobile: boolean;
	listening_to_spotify: boolean;
	user_id?: string;
}

declare type LanyardActivity = LanyardActivityLike;

declare interface LanyardActivityLike {
	id: string;
	name: string;
	type: DiscordActivityType;
	application_id: string;
	state: string;
	created_at: number;
	emoji?: {
		id: string;
		name: string;
		animated: boolean;
	};
	details?: string;
	assets?: {
		small_image?: string;
		small_text?: string;
		large_image?: string;
		large_text?: string;
	};
	timestamps: {
		start: number;
		end?: number;
	};
	party?: {
		// exists with Lanyard?
		id?: string;
		size?: string;
	};
}

declare interface LanyardInitPacket {
	subscribe_to_id: string;
}

declare interface LanyardHelloPacket {
	heartbeat_interval: number;
}

declare type LanyardEvent = 'PRESENCE_UPDATE' | 'INIT_STATE';

declare interface LanyardPacket {
	op: PID;
	d?: LanyardAPI | LanyardInitPacket | LanyardHelloPacket;
	t: LanyardEvent;
}

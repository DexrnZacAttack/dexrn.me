// https://lanyard.eggsy.xyz/api/getting-user-presence

declare interface LanyardSpotify {
	timestamps: DiscordTimestamps;
	album_art_url: string;
	album: string;
	artist: string;
	song: string;
	track_id: string;
}

declare interface LanyardAPI {
	kv: {
		lanyardOwner: string;
	};
	spotify?: LanyardSpotify;
	discord_user: DiscordUser;
	activities: LanyardActivity[];
	discord_status: 'online' | 'dnd' | 'idle' | 'offline';
	active_on_discord_web: boolean;
	active_on_discord_desktop: boolean;
	active_on_discord_mobile: boolean;
	active_on_discord_embedded: boolean;
	listening_to_spotify: boolean;
	user_id?: string;
}

declare type LanyardActivity = LanyardActivityLike;

declare interface LanyardActivityLike {
	flags?: number;
	session_id?: string;
	/** The activity's ID */
	id: string;
	/** The activity's name */
	name: string;
	/** The activity's type */
	type: DiscordActivityType;
	/** The activity's application ID */
	application_id: string;
	/** The activity's state */
	state: string;
	/** What time the activity was created */
	created_at: number;
	/** The corresponding activity's emoji (for custom statuses) */
	emoji?: {
		/** The emoji ID */
		id: string;
		/** The emoji name */
		name: string;
		/** Whether the emoji is animated */
		animated: boolean;
	};
	/** The activity's details */
	details?: string;
	/** The activity's assets */
	assets?: {
		/** Smaller image displayed alongside the large image */
		small_image?: string;
		/** Small image's tooltip text */
		small_text?: string;
		/** The activity's thumbnail image */
		large_image?: string;
		/** Large image's tooltip text */
		large_text?: string;
	};
	/** The activity's timestamps */
	timestamps: DiscordTimestamps;
	/** In-game party info */
	party?: {
		// exists with Lanyard?
		id?: string;
		size?: string;
	};
}

// region Protocol
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
// endregion

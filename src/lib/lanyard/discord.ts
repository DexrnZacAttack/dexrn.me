// https://discord.com/developers/docs/resources/user

export interface DiscordAvatarDecorationData {
	asset: string;
	sku_id: string;
	expires?: number;
}

// bc guild id can be a number sometimes in one case
export interface DiscordClan<T> {
	tag: string;
	identity_guild_id: T;
	badge: string;
	identity_enabled: boolean;
}

export interface DiscordTimestamps {
	/** When the activity started */
	start: number;
	/** When the activity should end */
	end?: number;
}

export interface DiscordUser {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	clan?: DiscordClan<string>;
	bot: boolean;
	global_name: number;
	primary_guild?: DiscordClan<number>;
	avatar_decoration_data?: DiscordAvatarDecorationData;
	collectibles: any; // unk
	display_name: number;
	public_flags: number;
}

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

export enum DiscordActivityType {
	Playing,
	Streaming,
	Listening,
	Watching,
	Custom,
	Competing
}

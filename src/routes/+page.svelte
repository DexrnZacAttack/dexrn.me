<script lang="ts">
	import Card from '../components/Card.svelte';
	import { pfp, customStatus, activities, onlineState } from '$lib/lanyard.js';
	import { DexrnSite } from '$lib/DexrnSite';
	import { lyIsOnBrowser, lyIsOnDesktop, lyIsOnMobile } from '$lib/store';
	import { blur, fade } from 'svelte/transition';
	import { DiscordActivityType } from '$lib/lanyard.js';
	import DiscordActivity from '../components/DiscordActivity.svelte';
	import { onMount } from 'svelte';
	import { t, waitLocale } from 'svelte-i18n';
	import { zoomIn } from '$lib/background';
	import { getCanvas } from '../components/Background.svelte';
	import { cubicOut } from 'svelte/easing';
	import validator from 'validator';
	import { status } from '$lib/loadingScreen';
	import pkg from '../../package.json';

	onMount(async () => {
		await waitLocale();
		await import('$lib/lanyard.js');
		await zoomIn(getCanvas());
	});
</script>

<svelte:head>
	<title>Dexrn's Website</title>
	<meta name="generator" content="SvelteKit {pkg.devDependencies['@sveltejs/kit'].substring(1)}" />
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<Card cardTitle={$t('path.home.discordStatus')}>
			<div class="lanyard">
				<div class="online">
					<img
						src={$pfp.image || 'https://avatars.githubusercontent.com/DexrnZacAttack'}
						width="128"
						height="128"
						class="pfp"
						style={`${DexrnSite.styleToString($pfp.style)}`}
						title={$onlineState.text}
					/>
					<div class="devices" transition:fade>
						<i
							class="bi bi-display statusIcon"
							title={$lyIsOnDesktop ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$lyIsOnDesktop ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
						<i
							class="bi bi-globe-americas statusIcon"
							title={$lyIsOnBrowser ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$lyIsOnBrowser ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
						<i
							class="bi bi-phone statusIcon"
							title={$lyIsOnMobile ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$lyIsOnMobile ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
					</div>
				</div>
				<div class="details">
					<p class="displayName">{$t('home.discordStatus.username')}</p>
					<p class="onlineStatus" style="color: {$onlineState.style.color}">{$onlineState.text}</p>
					{#if $customStatus.status || $customStatus.emoji}
						<div class="customStatus" transition:fade>
							{#if $customStatus.emoji && !$customStatus.em_id}
								<p class="statusEmoji">{$customStatus.emoji}</p>
							{:else if $customStatus.em_id}
								<img
									src="https://cdn.discordapp.com/emojis/{$customStatus.em_id}.png?size=64"
									class="statusEmojiImg"
									alt={$customStatus.emoji}
									title=":{$customStatus.emoji}:"
								/>
							{/if}
							<p class="status">{validator.escape($customStatus?.status ?? '')}</p>
						</div>
					{/if}
					<div class="platforms">
						<a
							href="https://github.com/DexrnZacAttack"
							aria-label={$t('platforms.github')}
							title={$t('platforms.github')}><i class="bi bi-github"></i></a
						>
						<a
							href="https://discord.com/users/485504221781950465"
							aria-label={$t('platforms.discord')}
							title={$t('platforms.discord')}><i class="bi bi-discord"></i></a
						>
						<a
							href="https://youtube.com/@DZac"
							aria-label={$t('platforms.youtube')}
							title={$t('platforms.youtube')}><i class="bi bi-youtube"></i></a
						>
						<a
							rel="me"
							href="https://wetdry.world/@zach"
							aria-label={$t('platforms.wdw')}
							title={$t('platforms.wdw')}><i class="bi bi-mastodon"></i></a
						>
					</div>
				</div>
			</div>
		</Card>
		{#if $activities && $activities.filter((a) => a.type !== DiscordActivityType.Custom).length !== 0}
			<Card cardTitle={$t('path.home.discordActivity')}>
				<div class="activities" transition:fade>
					{#each $activities as activity}
						{#if activity.type !== DiscordActivityType.Custom}
							<div transition:fade>
								<DiscordActivity {activity} />
							</div>
						{/if}
					{/each}
				</div>
			</Card>
		{/if}
		<div class="links">
			<Card cardTitle={$t('path.home.projects')}>
				<div class="buttons">
					<a href="https://team-lodestone.github.io" class="button"
						>{$t('buttons.home.projects.lodestone')}</a
					>
					<a href="https://liblce.dexrn.me" class="button">{$t('buttons.home.projects.libLCE')}</a>
					<a href="https://github.com/GRAnimated/MinecraftLCE" class="button"
						>{$t('buttons.home.projects.lce')}</a
					>
				</div>
			</Card>
			<Card cardTitle={$t('path.home.pages')}>
				<div class="buttons">
					<a href="/Blog" class="button" data-sveltekit-preload-data="hover"
						>{$t('buttons.home.pages.blog')}</a
					>
				</div>
			</Card>
		</div>
	</div>
{/if}

<style>
	.lanyard {
		display: flex;
		flex-direction: row;
	}

	.details {
		margin: 0 0 0 15px;
		display: flex;
		flex-direction: column;
		max-width: 310px;
	}

	.customStatus {
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		border-radius: 5px;
		background: var(--alt-bg-color-2);
		border: var(--prim-border-size) solid var(--prim-border-color);
		width: fit-content;
		padding: 5px;
		margin-top: 15px;
	}

	.status,
	.statusEmoji {
		text-wrap: wrap;
		margin: 0;
	}

	.statusEmoji {
		font-size: 1.5em;
	}

	.statusEmojiImg {
		height: 2em;
	}

	.displayName {
		margin: 0;
		font-size: 28px;
		font-weight: bold;
	}

	.pfp {
		border-radius: 10px;
	}

	.online {
		display: flex;
		flex-direction: column;
	}

	.devices {
		display: flex;
		flex-direction: row;
		margin-top: 15px;
		background-color: var(--alt-bg-color-2);
		justify-content: flex-start;
		align-content: center;
		border-radius: 10px;
		padding-left: 5px;
		padding-right: 5px;
		border: var(--prim-border-size) solid var(--prim-border-color);
		gap: 10px;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.statusIcon {
		font-size: 2em;
	}

	.activities {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 150px; /* just enough for mobile user to see that they can scroll */
		overflow-y: auto;
		overflow-x: hidden;
	}

	@media (min-height: 870px) {
		.activities {
			max-height: 300px;
		}
	}

	@media (min-height: 1010px) {
		.activities {
			max-height: 450px;
		}
	}

	.platforms {
		display: flex;
		flex-direction: row;
		background-color: var(--alt-bg-color-2);
		border-radius: 10px;
		border: var(--prim-border-size) solid var(--prim-border-color);
		padding-left: 5px;
		margin-top: auto;
		gap: 10px;
		max-width: 210px;
	}

	.platforms a i {
		font-size: 2em;
		color: var(--prim-text-color);
	}

	.links {
		display: flex;
		flex-direction: row;
		width: 55%;
		gap: 20px;
	}

	@media (max-width: 1465px) {
		.links {
			width: 60%;
		}
	}

	@media (max-width: 1221px) {
		.links {
			width: 80%;
		}
	}

	.onlineStatus {
		padding: 0;
		margin: 0;
	}

	.pfp,
	.onlineStatus,
	.statusIcon {
		transition:
			color 0.3s ease-out,
			border-color 0.3s ease-out,
			box-shadow 0.3s ease-out,
			background 0.3s ease-out;
	}
</style>

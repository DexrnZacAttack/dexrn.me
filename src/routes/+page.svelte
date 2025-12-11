<script lang="ts">
	import Card from '../components/Card.svelte';
	import { Lanyard } from '$lib/lanyard/Lanyard.js';
	import { blur, fade } from 'svelte/transition';
	import { DiscordActivityType } from '$lib/lanyard/discord';
	import DiscordActivity from '../components/DiscordActivity.svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import { t } from 'svelte-i18n';
	import { PanoramaBackground } from '$lib/PanoramaBackground';
	import { cubicOut } from 'svelte/easing';
	import validator from 'validator';
	import pkg from '../../package.json';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import { StringUtils } from '$lib/util/StringUtils';
	import type { Project } from '$lib/api/starlie';
	import CardTitle from '../components/CardTitle.svelte';

	const loadingStatus = LoadingScreen.Instance.Status;
	const lanyard = new Lanyard('485504221781950465');

	const pfp = lanyard.pfp;
	const onlineState = lanyard.onlineState;
	const customStatus = lanyard.customStatus;
	const activities = lanyard.activities;

	const onlineDesktop = lanyard.userOnDesktop;
	const onlineMobile = lanyard.userOnMobile;
	const onlineWeb = lanyard.userOnBrowser;

	let projectsCard: HTMLDivElement;
	let projects: HTMLElement[] = [];

	function onResize() {
		projects.forEach(p => {
			if (p.offsetLeft + p.getBoundingClientRect().width > projectsCard.clientWidth) {
				p.classList.add('invisible');
				return;
			}

			p.classList.remove('invisible');
		});
	}

	onMount(async () => {
		await lanyard.start();
		await PanoramaBackground.instance.transitionIn();

		await tick();
		onResize();
		window.onresize = onResize;
	});

	onDestroy(() => {
		window.onresize = null;
	});

	export let data: { projects?: Project[] };
</script>

<svelte:head>
	<title>Dexrn's Website</title>
	<meta content="SvelteKit {pkg.devDependencies['@sveltejs/kit'].substring(1)}" name="generator" />
</svelte:head>

{#if !$loadingStatus.transitioning && !$loadingStatus.loading}
	<div
		class="Page"
		transition:fade={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<Card cardTitle={$t('path.home.discordStatus')}>
			<div class="lanyard">
				<div class="online">
					<img
						src={$pfp.image || 'https://github.com/DexrnZacAttack.png'}
						width="128"
						height="128"
						class="pfp"
						style={`${StringUtils.styleToString($pfp.style)}`}
						alt={$t("home.discordStatus.profilePicture.title", { values: { displayName: $t("home.discordStatus.username"), status: $onlineState.text } })}
						title={$t("home.discordStatus.profilePicture.title", { values: { displayName: $t("home.discordStatus.username"), status: $onlineState.text } })}
					/>
					<div class="devices" transition:fade>
						<i
							class="bi bi-display statusIcon"
							title={$onlineDesktop ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$onlineDesktop ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
						<i
							class="bi bi-globe-americas statusIcon"
							title={$onlineWeb ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$onlineWeb ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
						<i
							class="bi bi-phone statusIcon"
							title={$onlineMobile ? $onlineState.text : $t('lanyard.status.offline')}
							style="color: {$onlineMobile ? $onlineState.style.color : '#747e8c'}"
							transition:blur
						></i>
					</div>
				</div>
				<div class="details">
					<div class="username">
						<p class="displayName">{$t('home.discordStatus.username')}</p>
						{#if $onlineState.text}
							<p class="onlineStatus" style="color: {$onlineState.style.color}">{$onlineState.text}</p>
						{/if}
					</div>
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
						<a href="https://github.com/DexrnZacAttack" aria-label={$t('platforms.github')}
							 title={$t('platforms.github')}>
							<i class="bi bi-github"></i>
						</a>
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
					{#each $activities as activity (activity.id)}
						{#if activity.type !== DiscordActivityType.Custom}
							<div transition:fade>
								<DiscordActivity {activity} />
							</div>
						{/if}
					{/each}
				</div>
			</Card>
		{/if}
		<div class="links cardFitToCenter">
			<Card class="card linkCard" bind:root={projectsCard}>
				<CardTitle>
					{$t('path.home.projects.path')}
					<a href="/Projects" class="moreButton" data-sveltekit-preload-data="hover"
						 aria-label={$t('path.home.projects.more.title')} title={$t('path.home.projects.more.title')}>
						...
					</a>
				</CardTitle>
				<div class="buttons">
					{#if data.projects}
						{#each data.projects as project, index (project.id)}
							<a href="{project.projectUrl}" bind:this={projects[index]} class="button">{project.name}</a>
						{/each}
					{:else}
						<p style="margin: auto;">Couldn't fetch projects, is the API down?</p>
					{/if}
				</div>
			</Card>
			<Card cardTitle={$t('path.home.pages')} class="card linkCard">
				<div class="buttons">
					<a href="/Blog" class="button" data-sveltekit-preload-data="hover"
					>{$t('buttons.home.pages.blog')}</a
					>
					<a href="/Projects" class="button" data-sveltekit-preload-data="hover"
					>{$t('buttons.home.pages.projects')}</a
					>
				</div>
			</Card>
		</div>
	</div>
{/if}

<style lang="scss">
  @use '$lib/stylesheets/components/card' as Card;

  .lanyard {
    display: flex;
    flex-direction: row;
  }

  .username {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .moreButton {
    text-decoration: none;
    margin-left: auto;
    color: var(--prim-text-color);
    opacity: 100% !important;
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
    box-sizing: border-box;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  :global(.linkCard) {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    width: 100%;
  }

  @media (max-width: Card.$card-level-2-device-width) {
    .links {
			justify-content: center;
			align-items: center;
      flex-direction: column !important;
      width: 100%;
    }
  }

  .onlineStatus {
    margin: 0;
    background-color: var(--alt-bg-color-2);
    padding: 5px;
    border-radius: 20px;
    border: 1px solid var(--prim-border-color);
  }

  .pfp,
  .onlineStatus,
  .statusIcon {
    transition: color 0.3s ease-out,
    border-color 0.3s ease-out,
    box-shadow 0.3s ease-out,
    background 0.3s ease-out;
  }
</style>

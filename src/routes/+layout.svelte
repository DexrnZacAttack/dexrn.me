<script lang="ts">
	import '$lib/Main';

	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	import '$lib/stylesheets/main.scss';
	import Background from '../components/Background.svelte';
	import { onMount, tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { DexrnSite } from '$lib/DexrnSite';
	import { PanoramaBackground, PanoramaBackground as OOPBackground } from '$lib/PanoramaBackground';
	import { cubicOut } from 'svelte/easing';
	import { page as curPage } from '$app/state';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import { isLoading, t, waitLocale } from 'svelte-i18n';

	let page: HTMLDivElement;
	let leaving: boolean = false;
	let loadingStatus = LoadingScreen.Instance.Status;

	function onUnload() {
		PanoramaBackground.instance.speed.set(0);
		LoadingScreen.Instance.loadingStatus = true;
		LoadingScreen.Instance.transitionStatus = false;
		leaving = true;
	}

	onMount(async () => {
		await waitLocale();
		new DexrnSite();

		window.addEventListener('beforeunload', onUnload);
	});

	// wish this could be cleaner
	beforeNavigate(async (e) => {
		if (DexrnSite.OUTER_ROUTES.includes(e.from?.route?.id ?? '') || !e.from?.route?.id) {
			if ((e.from?.route?.id ?? '') === '/Settings')
				LoadingScreen.Instance.loadingText = $t('settings.saving');

			LoadingScreen.Instance.loadingStatus = true;
			LoadingScreen.Instance.transitionStatus = true;
			if (!e.from?.route?.id) await OOPBackground.instance.speed.set(8);
			return;
		}

		if (!leaving) await OOPBackground.instance.transitionOut();
	});

	// same with this
	afterNavigate(async (e) => {
		leaving = false;
		if (
			DexrnSite.OUTER_ROUTES.includes(e.to?.route?.id ?? '') ||
			!e.to?.route?.id ||
			e.type === 'enter'
		) {
			if (e.type == 'enter') {
				await tick(); // otherwise instance doesn't exist
				await OOPBackground.instance.transitionOut();
			}

			// reset the text
			LoadingScreen.Instance.loadingText = $t('loadingScreen.loading');
			await DexrnSite.sleep(250);
			await OOPBackground.instance.speed.set(2);
			return;
		}
	});

	const goHome = () => {
		$loadingStatus.loadingError = false;
		goto('/');
	};

	const goBack = () => {
		$loadingStatus.loadingError = false;
		history.back();
	};
</script>

{#if !leaving}
	<Background />
{/if}
{#if !$isLoading && !$loadingStatus.bgLoading}
	<div
		class="page"
		bind:this={page}
		in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade={{ duration: 200, easing: cubicOut }}
	>
		{#if !DexrnSite.OUTER_ROUTES.includes(curPage?.route?.id ?? '') && curPage.route?.id && !$loadingStatus.transitioning && !$loadingStatus.loading}
			<a
				aria-label="Settings button"
				href="/Settings"
				class="button settingsIcon"
				in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
				out:fade={{ duration: 200, easing: cubicOut }}><i class="bi bi-gear"></i></a
			>
		{/if}
		<slot />
	</div>
{/if}
{#if $loadingStatus.loading && !$isLoading}
	<div class="loadingScreen">
		{#if $loadingStatus.loadingError && !leaving}
			<button
				on:click={goBack}
				class="button escape"
				aria-label={$t('common.back')}
				title={$t('common.back')}
				in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
				out:fade={{ duration: 200, easing: cubicOut }}
			>
				<i class="bi bi-arrow-left"></i>
			</button>

			<button
				on:click={goHome}
				class="button escapeHome"
				aria-label={$t('common.home')}
				title={$t('common.home')}
				in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
				out:fade={{ duration: 200, easing: cubicOut }}
			>
				<i class="bi bi-house"></i>
			</button>
		{/if}
		<h1
			class="loadingText"
			in:slide={{ delay: 200, duration: 200, easing: cubicOut }}
			out:slide={{ delay: 0, duration: 200, easing: cubicOut }}
		>
			{$loadingStatus.loadingScreenText}
		</h1>
	</div>
{/if}

<style>
    .page {
        height: 100vh;
    }

    .loadingScreen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
    }

    .settingsIcon {
        position: absolute;
        bottom: 8px;
        right: 16px;
        font-size: 18px;
        background: var(--prim-bg-color);
        backdrop-filter: none;
    }

    .loadingText {
        margin: 0;
        border-radius: 10px 10px 0 0;
        padding: 0 0 0.5rem 1rem;
    }

    .escape {
        position: absolute;
        bottom: calc(var(--vh) - 130px);
        right: calc(var(--vw) - 130px);
        background: var(--prim-bg-color);
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        width: 1.5em;
        height: 1.5em;
        border: var(--prim-border-size) solid var(--prim-border-color);
        border-radius: 5px;
    }

    .escapeHome {
        position: absolute;
        bottom: calc(var(--vh) - 130px);
        left: calc(var(--vw) - 130px);
        background: var(--prim-bg-color);
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        width: 1.5em;
        height: 1.5em;
        border: var(--prim-border-size) solid var(--prim-border-color);
        border-radius: 5px;
    }
</style>

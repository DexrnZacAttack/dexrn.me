<script lang="ts">
	import Card from '../../components/Card.svelte';
	import BooleanSetting from '../../components/Settings/BooleanSetting.svelte';
	import { DexrnSite } from '$lib/DexrnSite';
	import { onMount } from 'svelte';
	import { speed } from '$lib/store';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { status, LoadingScreen } from '$lib/loadingScreen';

	onMount(async () => {
		await DexrnSite.sleep(200, true); // race condition
		LoadingScreen.loadingStatus = false;
		LoadingScreen.transitionStatus = false;
	});

	const changeBg = async (active: boolean) => {
		await speed.set(!active ? 1 : 0);
	};
</script>

<svelte:head>
	<title>@Dexrn | Settings</title>
	<meta property="twitter:title" content="Dexrn's Website | Settings" />
	<meta property="og:title" content="Dexrn's Website | Settings" />
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade={{ duration: 200, easing: cubicOut }}
	>
		<Card cardTitle={$t('path.settings')}>
			<div class="settings">
				<BooleanSetting id="useLightMode" />
				<BooleanSetting id="noSleep" />
				<BooleanSetting id="doNotScrollPanorama" onChange={changeBg} />
			</div>
			<button on:click={DexrnSite.back} class="button">{$t('common.exit')}</button>
		</Card>
		<p class="version" title={$t('settings.version', { values: { ver: DexrnSite.getVersion(), date: new Date(DexrnSite.getPostBuildTime()).toString() } })}>{DexrnSite.getVersion()}</p>
	</div>
{/if}

<style>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 10px;
	}

	.Page {
		padding-top: 6%;
	}

	.version {
		position: absolute;
		top: calc(var(--vh) - 150px);
		right: calc(var(--vw) - 145px);
		background: var(--alt-bg-color);
		padding: 5px;
		border: var(--prim-border-size) solid var(--prim-border-color);
		border-radius: 5px;
	}
</style>

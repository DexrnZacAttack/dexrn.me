<script lang="ts">
	import Card from '../../components/Card.svelte';
	import BooleanSetting from '../../components/Settings/BooleanSetting.svelte';
	import { DexrnSite } from '$lib/DexrnSite';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { t, waitLocale } from 'svelte-i18n';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import { PanoramaBackground } from '$lib/PanoramaBackground';
	import { Utils } from '$lib/util/Utils';
	import type { VersionResponse } from '$lib/api/starlie';

	const loadingStatus = LoadingScreen.Instance.Status;

	onMount(async () => {
		await waitLocale();
		await DexrnSite.sleep(200, true); // race condition
		LoadingScreen.Instance.loadingStatus = false;
		LoadingScreen.Instance.transitionStatus = false;
	});

	const changeBg = async (active: boolean) => {
		await PanoramaBackground.instance.speed.set(!active ? 1 : 0);
	};

	export let data: { version: VersionResponse };
</script>

<svelte:head>
	<title>@Dexrn | Settings</title>
	<meta content="Dexrn's Website | Settings" property="twitter:title" />
	<meta content="Dexrn's Website | Settings" property="og:title" />
</svelte:head>

{#if !$loadingStatus.transitioning && !$loadingStatus.loading}
	<div
		class="Page"
		transition:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<Card cardTitle={$t('path.settings')}>
			<div class="settings">
				<BooleanSetting id="useLightMode" />
				<BooleanSetting id="noSleep" />
				<BooleanSetting id="doNotScrollPanorama" onChange={changeBg} />
			</div>
			<button on:click={Utils.back} class="button">{$t('common.exit')}</button>
		</Card>
		<p
			class="version"
			title={$t('settings.version', {
				values: {
					ver: DexrnSite.getVersion(),
					starlieVer: data.version.version
				}
			})}
		>
			v{DexrnSite.getVersion()} | v{data.version.version}
		</p>
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
        right: calc(var(--vw) - 220px);
        background: var(--alt-bg-color);
        padding: 5px;
        border: var(--prim-border-size) solid var(--prim-border-color);
        border-radius: 5px;
    }
</style>

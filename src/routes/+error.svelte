<script lang="ts">
	import { page } from '$app/state';
	import Card from '../components/Card.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { status, LoadingScreen } from '$lib/loadingScreen';
	import { DexrnSite } from '$lib/DexrnSite';

	onMount(async () => {
		await DexrnSite.sleep(200);
		LoadingScreen.loadingStatus = false;
		LoadingScreen.transitionStatus = false;
	});
</script>

<svelte:head>
	<title>@Dexrn | {page?.error?.message}</title>
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade={{ duration: 200, easing: cubicOut }}
	>
		<Card cardTitle={$t('path.error')}>
			<h1>
				{$t('error.reason', { values: { status: page?.status, message: page?.error?.message } })}
			</h1>
			<p>{$t('error.message')}</p>
			<a href="/" class="button">{$t('common.home')}</a>
		</Card>
	</div>
{/if}

<script lang="ts">
	import Card from '../../../components/Card.svelte';
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CardTop from '../../../components/CardTop.svelte';
	import { getCanvas } from '../../../components/Background.svelte';
	import { LoadingScreen, status } from '$lib/loadingScreen';
	import type { Post } from '$lib/api';
	import { zoomIn } from '$lib/background';

	onMount(async () => {
		LoadingScreen.loadingText = `Loading post '${data?.post?.title ?? ''}''`;
		await zoomIn(getCanvas());
		LoadingScreen.resetLoadingScreenText();
		LoadingScreen.loadingStatus = false;
	});

	export let data: { post?: Post; body?: string };
	const post = data?.post;
	const body = data?.body;
</script>

<svelte:head>
	<meta property="og:title" content="Dexrn's Website | {post?.title ?? 'Loading post...'}" />
	<meta property="og:type" content="article" />
	<meta property="og:description" content={post?.body ? `${post?.body.substring(0, 25)}...` : ''} />
	<meta property="article:published_time" content={post?.timestamp?.toString() ?? '0'} />
	<meta property="article:author" content="Dexrn ZacAttack" />
	<meta name="fediverse:creator" content="@zach@wetdry.world" />
	<title>@Dexrn | {post?.title ?? 'Loading post...'}</title>
	<meta property="twitter:title" content="Dexrn's Website | {post?.title ?? 'Loading post...'}" />
	<meta
		property="twitter:description"
		content={post?.body ? `${post?.body.substring(0, 25)}...` : ''}
	/>
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		{#if post}
			<CardTop></CardTop>
			<Card
				cardTitle={$t('path.blog.post', {
					values: { title: post?.title ?? $t('loadingScreen.loading') }
				})}
			>
				<div class="content">
					{@html body}
				</div>
			</Card>
		{/if}
	</div>
{/if}

<style>
	.Page {
		height: 100%;
		justify-content: unset; /* makes element taller than I can scroll if set */
		overflow-y: auto;
		padding-bottom: 15px; /* overflow breaks shadows */
	}

	.blogCard {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 100%;
	}

	:global .content p img {
		height: 250px;
		object-fit: contain;
		max-width: 50%;
	}
</style>

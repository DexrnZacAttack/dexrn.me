<script lang="ts">
	import Card from '../../../components/Card.svelte';
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CardTop from '../../../components/CardTop.svelte';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import type { ApiPost } from '$lib/api/starlie';
	import { PanoramaBackground } from '$lib/PanoramaBackground';

	const loadingStatus = LoadingScreen.Instance.Status;

	onMount(async () => {
		await PanoramaBackground.instance.transitionIn();
		LoadingScreen.Instance.resetLoadingScreenText();
		LoadingScreen.Instance.loadingStatus = false;
	});

	export let data: { post?: ApiPost, body?: string };
	const post = data?.post;
	const body = data?.body;
</script>

<svelte:head>
	<meta content="Dexrn's Website | {post?.title ?? 'Loading post...'}" property="og:title" />
	<meta content="article" property="og:type" />
	<meta content={post?.content ? `${post?.content.substring(0, 25)}...` : ''} property="og:description" />
	<meta content={new Date(post?.created ?? 0)?.getTime() ?? '0'} property="article:published_time" />
	<meta content="Dexrn ZacAttack" property="article:author" />
	<meta content="@zach@wetdry.world" name="fediverse:creator" />
	<title>@Dexrn | {post?.title ?? 'Loading post...'}</title>
	<meta content="Dexrn's Website | {post?.title ?? 'Loading post...'}" property="twitter:title" />
	<meta
		content={post?.content ? `${post?.content.substring(0, 25)}...` : ''}
		property="twitter:description"
	/>
</svelte:head>

{#if !$loadingStatus.transitioning && !$loadingStatus.loading}
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

    :global .content p img {
        height: 250px;
        object-fit: contain;
        max-width: 50%;
    }
</style>

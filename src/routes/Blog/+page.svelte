<script lang="ts">
	import { fetchPosts } from '$lib/blog';
	import { onMount } from 'svelte';
	import Card from '../../components/Card.svelte';
	import { posts } from '$lib/store';
	import { goto } from '$app/navigation';
	import { zoomIn } from '$lib/background';
	import { getCanvas } from '../../components/Background.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import CardTop from '../../components/CardTop.svelte';
	import { t } from 'svelte-i18n';
	import { status, LoadingScreen } from '$lib/loadingScreen';
	import { DexrnSite } from '$lib/DexrnSite';

	let loading = true;

	onMount(async () => {
		// for loading text
		await DexrnSite.sleep(100);
		LoadingScreen.loadingStatus = true;
		LoadingScreen.loadingText = $t('blog.fetchingPosts');
		posts.set(await fetchPosts());

		if (!$posts) {
			await LoadingScreen.setShowLoadingScreenError(true, $t('errors.postsFetchFailed'));
			return;
		}

		loading = false;
		await zoomIn(getCanvas());
		LoadingScreen.resetLoadingScreenText();
		LoadingScreen.loadingStatus = false;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content="@Dexrn | Blog" />
	<title>@Dexrn | Blog</title>
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<CardTop></CardTop>
		<Card cardTitle={$t('path.blog.path')}>
			{#if loading}
				<h1>{$t('blog.fetchingPosts')}</h1>
			{:else}
				<div class="posts">
					{#each $posts as post}
						<div
							class="post"
							tabindex="0"
							role="button"
							on:click={() => goto(`/Blog/${post.title}`)}
						>
							<h2 class="title">{post.title}</h2>
							<p class="date">
								{`${new Date(post.timestamp).toDateString()} ${new Date(post.timestamp).toLocaleTimeString()}`}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</Card>
	</div>
{/if}

<style>
	.title {
		margin: 0;
	}

	.posts {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.date {
		margin-left: auto;
	}

	.post {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: var(--alt-bg-color);
		border: var(--alt-border-size) solid var(--prim-border-color);

		border-radius: 10px;
		padding: 5px;
		cursor: pointer;
	}
</style>

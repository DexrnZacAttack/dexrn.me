<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../../components/Card.svelte';
	import { goto } from '$app/navigation';
	import { zoomIn } from '$lib/background';
	import { getCanvas } from '../../components/Background.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import CardTop from '../../components/CardTop.svelte';
	import { t } from 'svelte-i18n';
	import { status, LoadingScreen } from '$lib/loadingScreen';
	import type { PostInfo } from '$lib/api';

	onMount(async () => {
		LoadingScreen.loadingText = `Loading posts...`;
		await zoomIn(getCanvas());
		LoadingScreen.resetLoadingScreenText();
		LoadingScreen.loadingStatus = false;
	});

	export let data: { posts: PostInfo[] };
</script>

<svelte:head>
	<meta property="og:title" content="Dexrn's Website | Blog" />
	<title>@Dexrn | Blog</title>
</svelte:head>

{#if !$status.transitioning && !$status.loading}
	<div
		class="Page"
		in:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<CardTop></CardTop>
		<Card cardTitle={$t('path.blog.path')}>
			<div class="posts">
				{#each data.posts as post (post.id)}
					<a
						data-sveltekit-preload-data="hover"
						class="post"
						tabindex="0"
						role="button"
						href="/Blog/{post.title}"
					>
						<h2 class="title">{post.title}</h2>
						<p class="date">
							{`${new Date(post.timestamp).toDateString()} ${new Date(post.timestamp).toLocaleTimeString()}`}
						</p>
					</a>
				{/each}
			</div>
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

	a {
		text-decoration: none;
		color: inherit;
	}
</style>

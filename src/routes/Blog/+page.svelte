<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../../components/Card.svelte';
	import { PanoramaBackground } from '$lib/PanoramaBackground';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import CardTop from '../../components/CardTop.svelte';
	import { t } from 'svelte-i18n';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import type { FullPost } from '$lib/api/starlie';
	import { type PlainResponseError } from '$lib/error/ResponseError';
	import { ResponseError } from '$lib/error/ResponseError.js';
	import { StringUtils } from '$lib/util/StringUtils.js';

	const loadingStatus = LoadingScreen.Instance.Status;

	onMount(async () => {
		await PanoramaBackground.instance.transitionIn();
		LoadingScreen.Instance.resetLoadingScreenText();
		LoadingScreen.Instance.loadingStatus = false;
	});

	export let data: { posts?: FullPost[], error?: PlainResponseError };
</script>

<svelte:head>
	<meta content="Dexrn's Website | Blog" property="og:title" />
	<title>@Dexrn | Blog</title>
</svelte:head>

{#if !$loadingStatus.transitioning && !$loadingStatus.loading}
	<div
		class="Page"
		in:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<CardTop classes="blogCard"></CardTop>
		<Card cardTitle={$t('path.blog.path')} classes="blogCard">
			<div class="posts">
				{#if data.posts}
					{#if data.posts.length > 0}
						{#each data.posts as post (post.id)}
							<a
								data-sveltekit-preload-data="hover"
								class="post"
								tabindex="0"
								role="button"
								href="/Blog/{post.id}"
							>
								<img class="logo" src={post.thumbnailUrl} />
								<h3 class="title">{post.title}</h3>
								<div class="bottom">
									<div class="authors">
										{#each post.authors as author (author.username)}
											<img class="avatar" width="32" height="32" src="{author?.avatarUrl}"
													 title="Profile picture of author '{author.displayName}'"
													 alt="Profile picture of author '{author.displayName}'">
										{/each}
									</div>
									<p class="date" title={$t('post.modifiedDate.title', { values: { "date": new Date(post.created).toLocaleString() } })}>
										{new Date(post.modified).toLocaleString()}
									</p>
								</div>
							</a>
						{/each}
					{:else}
						<div class="error">
							<h1 class="errorText">No posts were returned.</h1>
						</div>
					{/if}
				{:else if data.error}
					<div class="error">
						<h2 class="errorText">Couldn't fetch posts as the API returned an error</h2>
						<code class="codeblock">{ResponseError.toString(data.error)}</code>
					</div>
				{:else}
					<h2 class="errorText">Couldn't fetch posts! This is a bug.</h2>
				{/if}
			</div>
		</Card>
	</div>
{/if}

<style>
    .Page {
        height: 100%;
        justify-content: unset; /* makes element taller than I can scroll if set */
        overflow-y: auto;
        padding-bottom: 15px; /* overflow breaks shadows */
    }

    .title {
        margin: 0 0 10px;
        padding: 0;
				word-wrap: break-word;
				overflow: hidden;
				text-overflow: ellipsis;
    }

    .posts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        grid-template-rows: repeat(auto-fit, minmax(300px, max-content));
        gap: 16px;
    }

    .date {
				cursor: help;
        margin: 5px 0 0;
    }

    .post {
        display: flex;
        flex-direction: column;
        background: var(--prim-control-color);
        border: 1px solid var(--prim-border-color);

        width: 300px;
        height: 300px;
        border-radius: 20px;
        padding: 5px;
        cursor: pointer;
    }

    .logo {
        border-radius: 15px 15px 15px 15px;
        border: var(--prim-border-size) solid var(--alt-bg-color);

        aspect-ratio: 16/9;
        max-height: 100%;
        max-width: 100%;

        background-color: var(--alt-bg-color);
    }

    .errorText {
        margin-top: 0;
        align-self: center;
    }

    .error {
        display: flex;
        flex-direction: column;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    .avatar {
        border-radius: 10px;
    }

    .bottom {
        margin-top: auto;
    }

    .authors {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }
</style>

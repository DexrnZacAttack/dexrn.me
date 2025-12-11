<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../../components/Card.svelte';
	import { PanoramaBackground } from '$lib/PanoramaBackground';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import CardTop from '../../components/CardTop.svelte';
	import { t } from 'svelte-i18n';
	import { LoadingScreen } from '$lib/LoadingScreen';
	import { type PlainResponseError } from '$lib/error/ResponseError';
	import { ResponseError } from '$lib/error/ResponseError.js';
	import type { Project } from '$lib/api/starlie';
	import ProjectComponent from '../../components/Project.svelte';
	import Organization from '../../components/Organization.svelte';

	const loadingStatus = LoadingScreen.Instance.Status;

	onMount(async () => {
		await PanoramaBackground.instance.transitionIn();
		LoadingScreen.Instance.resetLoadingScreenText();
		LoadingScreen.Instance.loadingStatus = false;
	});

	export let data: { projects?: Project[], organizations?: Project[], error?: PlainResponseError };
</script>

<svelte:head>
	<meta content="Dexrn's Website | Projects" property="og:title" />
	<title>@Dexrn | Projects</title>
</svelte:head>

{#if !$loadingStatus.transitioning && !$loadingStatus.loading}
	<div
		class="Page"
		in:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
		out:fade|global={{ delay: 200, duration: 200, easing: cubicOut }}
	>
		<CardTop></CardTop>
		<Card cardTitle={$t('path.projects.path')}>
			<div class="projects">
				{#if data.organizations && data.organizations.length > 0}
					<h1 class="typeTitle">{$t('projects.types.organization')}</h1>
					{#each data.organizations as org (org.id)}
						<Organization org={org}></Organization>
					{/each}
				{/if}
				{#if data.projects && data.projects.length > 0}
					{#if data.organizations && data.organizations.length > 0}
						<h1 class="typeTitle">{$t('projects.types.project')}</h1>
					{/if}
					{#if data.projects.length > 0}
						{#each data.projects as project (project.id)}
							<ProjectComponent project={project}></ProjectComponent>
						{/each}
					{:else}
						<div class="error">
							<h1 class="errorText">No projects were returned.</h1>
						</div>
					{/if}
				{:else if data.error}
					<div class="error">
						<h2 class="errorText">Couldn't fetch projects as the API returned an error</h2>
						<code class="codeblock">{ResponseError.toString(data.error)}</code>
					</div>
				{:else}
					<h2 class="errorText">No projects were returned</h2>
				{/if}
			</div>
		</Card>
	</div>
{/if}

<style>
    .typeTitle {
        margin: 0;
    }

    .Page {
        height: 100%;
        justify-content: unset; /* makes element taller than I can scroll if set */
        overflow-y: auto;
        padding-bottom: 5vh; /* overflow breaks shadows */
    }

    .projects {
        display: flex;
        flex-direction: column;
        gap: 10px;
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
</style>

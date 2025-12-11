<script lang="ts">
	import type { Project } from '$lib/api/starlie';
	import { marked } from 'marked';
	import { t } from 'svelte-i18n';

	export let org: Project;

	let d = 0;

	const renderer = new marked.Renderer();
	renderer.paragraph = function(t) {
		return (d++ === 0)
			? `<p class="projectDescription">${t.text}</p>`
			: `<p>${t.text}</p>`;
	};
</script>

<div
	class="project"
	role="button"
	tabindex="0"
>
	<div class="row" id="projInfo">
		<div class="left">
			{#if org.logoUrl}
				<img class="logo" src={org.logoUrl} title={
				$t('organization.logo.title', {
						values: {
							organizationName: org.name
						}
					}
				)} alt={
				$t('organization.logo.title', {
					values: {
						organizationName: org.name
					}
				}
				)} />
			{/if}
			<div class="projInfo">
				<div class="row">
					<h3 class="title">{org.name}</h3>
				</div>
				{#if org.description}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html marked.parse(org.description, { renderer })}
				{/if}
			</div>
		</div>
		{#if org.projectUrl}
			<a class="button projButton" href="{org.projectUrl}">{$t("project.visitOrganization")}</a>
		{/if}
	</div>
</div>
<style>
    :global(.projectDescription) {
        padding: 0;
        margin: 0 5px 0 0;
    }

    .title {
        margin: 0;
        padding: 0;
    }

    .title {
        color: var(--project-type-organization);
        text-shadow: 0 0 30px var(--project-type-organization);
    }

    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #projInfo {
        margin: 5px;
        flex: 1;
    }

    .left {
        display: flex;
        flex-direction: row;
        text-align: center;
    }

    .project {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--alt-bg-color);
        border: 1px solid var(--prim-border-color);

        flex-shrink: 0;
        width: 100%;
        border-radius: 20px;
        gap: 10px;
        overflow: hidden;
    }

    .projButton {
        display: flex;
        margin-left: auto;
        border-radius: 15px;
        align-items: center;
        justify-content: center;
        height: 70px;
    }

    .projInfo {
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-left: 10px;
    }

    .logo {
        border-radius: 15px 15px 15px 15px;
        border: var(--prim-border-size) solid var(--alt-bg-color);

        height: 64px;
        width: 64px;

        background-color: var(--behind-background-color);
        align-self: center;
    }
</style>
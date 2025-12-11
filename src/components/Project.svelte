<script lang="ts">
	import { ProjectStageImpl } from '$lib/api/types/ProjectStage.js';
	import ProgressBar from './ProgressBar.svelte';
	import type { Project } from '$lib/api/starlie';
	import { marked } from 'marked';
	import { ProjectStage } from '$lib/api/ProjectsApi';
	import { StringUtils } from '$lib/util/StringUtils';
	import { t } from 'svelte-i18n';

	export let project: Project;

	const stage = project.stage || ProjectStage.NotTracked;
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
			{#if project.logoUrl}
				<img class="logo" src={project.logoUrl}
						 alt={$t('project.logo.title', { values: { projectName: project.name } })}
						 title={$t('project.logo.title', { values: { projectName: project.name } })} />
			{/if}
			<div class="projInfo">
				<div class="row">
					<h3
						class="title {StringUtils.firstLetterToLowerCase(StringUtils.enumToString(ProjectStage, stage) || 'Unknown')}"
						title="{$t('project.title.title', { values: { stageName: ProjectStageImpl.toString(stage), stageDescription: ProjectStageImpl.toDescriptionString(stage) } })}">{project.name}</h3>
					{#if project.stageReason}
						<i class="stageReason bi bi-question"
							 title={$t('project.stageReason.title', { values: { stage: ProjectStageImpl.toString(stage), reason: project.stageReason } })}></i>
					{/if}
				</div>
				{#if project.description}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html marked.parse(project.description, { renderer })}
				{/if}
			</div>
		</div>
		{#if project.projectUrl}
			<a class="button projButton" href="{project.projectUrl}">{$t("project.visitProject")}</a>
		{/if}
	</div>
	{#if project.percentageComplete}
		<ProgressBar value={project.percentageComplete} max={100} class="progress" color={ProjectStageImpl.getColor(stage)}
								 title="~{project.percentageComplete}% complete"
								 barStyle="box-shadow: 10px 0px 30px {ProjectStageImpl.getColor(stage)};"></ProgressBar>
	{/if}
</div>

<style lang="scss">
  .stageReason {
    border-radius: 10px;
    font-size: 1.2em;
    background-color: var(--alt-bg-color-2);
    cursor: help;
    margin-left: 5px;
  }

  :global(.projectDescription) {
    padding: 0;
    margin: 0 5px 0 0;
  }

  .title {
    margin: 0;
    padding: 0;

    cursor: help;

    &.discontinued {
      color: var(--project-stage-discontinued);
      text-shadow: 0 0 30px var(--project-stage-discontinued);
    }

    &.inactive {
      color: var(--project-stage-inactive);
      text-shadow: 0 0 30px var(--project-stage-inactive);
    }

    &.notTracked {
      color: var(--project-stage-not-tracked);
      text-shadow: 0 0 30px var(--project-stage-not-tracked);
    }

    &.paused {
      color: var(--project-stage-paused);
      text-shadow: 0 0 30px var(--project-stage-paused);
    }

    &.inProgress {
      color: var(--project-stage-in-progress);
      text-shadow: 0 0 30px var(--project-stage-in-progress);
    }

    &.featureComplete {
      color: var(--project-stage-feature-complete);
      text-shadow: 0 0 30px var(--project-stage-feature-complete);
    }
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

  :global(.progress) {
    height: 10px;
    background-color: var(--alt-bg-color);
    width: 100%;
    border: none;
    overflow: hidden;
    cursor: help;
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
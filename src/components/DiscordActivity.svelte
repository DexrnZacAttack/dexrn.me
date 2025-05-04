<script lang="ts">
	import { getImage } from '$lib/lanyard.js';
	import { DexrnSite } from '$lib/DexrnSite.js';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import TimeElapsedProgress from './TimeElapsedProgress.svelte';

	export let activity: LanyardActivity;

	let now = Date.now();
	let tick: number;

	onMount(async () => {
		tick = setInterval(() => {
			now = Date.now();
		}, 1000);

		onDestroy(() => {
			clearInterval(tick);
		});
	});
</script>

<div class="activity" transition:fade>
	<!-- MainActivity.java -->
	<div class="mainActivity">
		{#if activity.assets?.large_image}
			<div class="activityImages">
				<img
					class="largeImage"
					width="96"
					height="96"
					title={activity.assets?.large_text}
					src={getImage(activity.assets?.large_image, activity.application_id)}
				/>
				{#if activity.assets?.small_image}
					<img
						class="smallImage"
						width="32"
						height="32"
						title={activity.assets?.small_text}
						src={getImage(activity.assets?.small_image, activity.application_id)}
					/>
				{/if}
			</div>
		{:else if activity.assets?.small_image}
			<img
				class="smallImageEx"
				width="96"
				height="96"
				title={activity.assets?.small_text}
				src={getImage(activity.assets?.small_image, activity.application_id)}
			/>
		{:else if activity.application_id}
			<img
				class="largeImage"
				width="96"
				height="96"
				title={activity.assets?.large_text}
				src={`https://dcdn.dstn.to/app-icons/${activity.application_id}.png?size=96`}
			/>
		{/if}
		<div class="activityDetails">
			<p class="activityName">{activity.name}</p>
			<p class="activityDetail">{activity.details}</p>
			<p class="activityState">{activity.state}</p>
			{#if activity.timestamps?.start && !activity.timestamps?.end}
				<p class="activityTimer">
					{DexrnSite.timeSince(now, activity.timestamps.start)}
				</p>
			{/if}
		</div>
	</div>
	{#if activity.timestamps?.start && activity.timestamps?.end}
		<div class="activityTimeElapsedBar">
			<span class="activityTimeStart">{DexrnSite.timeSince(now, activity.timestamps?.start)}</span>
			<TimeElapsedProgress
				class="activityElapsed"
				end={activity.timestamps.end}
				start={activity.timestamps.start}
			/>
			<span class="activityTimeEnd"
				>{DexrnSite.timeSince(activity.timestamps?.end, activity.timestamps?.start)}</span
			>
		</div>
	{/if}
</div>

<style>
	.activity {
		background: var(--alt-bg-color);
		border: var(--alt-border-size) solid var(--prim-border-color);
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		min-height: 128px;
	}

	.mainActivity {
		display: flex;
		flex-direction: row;
	}

	.activityDetails {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		margin-top: 5px;
		max-height: 96px;
	}

	.activityName,
	.activityDetail,
	.activityState,
	.activityTimer {
		margin: 0;
	}

	.activityName {
		font-size: 1.5em;
		font-weight: bold;
	}

	.largeImage,
	.smallImageEx {
		border-radius: 10px;
		margin-left: 10px;
		margin-top: 10px;
		background: var(--alt-bg-color);
		padding: 5px;
	}

	.activityImages {
		position: relative;
		display: inline-block;
		max-height: 96px;
	}

	.smallImage {
		position: absolute;
		bottom: -10px;
		right: -5px;
		border: var(--prim-border-size) solid var(--prim-border-color);
		background: var(--alt-bg-color);
		border-radius: 50%;
	}

	.activityTimeElapsedBar {
		display: flex;
		flex-direction: row;
		gap: 5px;
		text-align: left;
		align-items: center;
		width: 100%;
		margin-left: 10px;
		margin-top: 15px;
	}

	:global(.activityElapsed) {
		flex: 1;
	}

	.activityTimeEnd {
		padding-right: 20px;
	}
</style>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let end: number;
	export let start: number;

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

<progress
	max="100"
	value={Math.min(100, ((now - start) / (end - start)) * 100)}
	class="timeElapsed"
	{...$$restProps}
></progress>

<style>
	progress {
		border-radius: 5px;
		height: 6px;
		background-color: var(--alt-inverse-bg-color);
		border: none;
	}

	progress::-webkit-progress-value {
		background-color: var(--prim-text-color);
		border-radius: 5px;
	}

	progress::-moz-progress-bar {
		background-color: var(--prim-text-color);
		border-radius: 5px;
	}

	progress::-webkit-progress-bar {
		border-radius: 5px;
	}
</style>

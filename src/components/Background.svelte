<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PanoramaBackground } from '$lib/PanoramaBackground.js';

	let bg: HTMLCanvasElement;

	onMount(async () => {
		await tick();

		const inst = new PanoramaBackground(bg);
		await inst.setup();
		inst.begin();
	});
</script>

<canvas bind:this={bg} class="bg" transition:fade={{ duration: 200 }}></canvas>

<style>
    .bg {
        z-index: -1;
        position: absolute;
        width: 100vw;
        height: 100vh;
        gap: 10px;
        margin: 0;
        padding: 0;
        top: calc(50% - 1px); /* amazing */
        left: 50%;
        transform: translate(-50%, -50%);
        border: 0 solid var(--behind-border-color); /* so the browser will animate it */

        transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        height 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        border-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        border-radius 0.3s,
        background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
</style>

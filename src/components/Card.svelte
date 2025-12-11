<script lang="ts">
	import CardTitle from './CardTitle.svelte';

	export let cardTitle = '';
	export let classes = '';

	export let root: HTMLDivElement = null!;
</script>

<div {...$$restProps} bind:this={root} class="card cardFitToCenter {classes}" on:click>
	{#if cardTitle}
		<CardTitle>{cardTitle}</CardTitle>
	{/if}
	<slot></slot>
</div>

<style>
    .card {
        backdrop-filter: blur(40px);
        border-radius: 10px;
        padding: 12px;
        border: var(--prim-border-size) solid var(--prim-border-color);
        background: var(--prim-bg-color);
        box-shadow: 0 0 10px 5px var(--prim-shadow-color);
        color: var(--prim-text-color);
        transition: background-color 0.25s,
        box-shadow 0.25s,
        color 0.25s;
    }
</style>

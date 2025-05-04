<script lang="ts">
	import CardTitle from './CardTitle.svelte';

	export let cardTitle = '';
</script>

<div class="card" {...$$props} on:click>
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
		width: 50%;
		border: var(--prim-border-size) solid var(--prim-border-color);
		background: var(--prim-bg-color);
		box-shadow: 0 0 10px 5px var(--prim-shadow-color);
		color: var(--prim-text-color);
		transition:
			background-color 0.25s,
			box-shadow 0.25s,
			color 0.25s;
	}

	@media (max-width: 1465px) {
		.card {
			width: 60%;
		}
	}

	@media (max-width: 1221px) {
		.card {
			width: 80%;
		}
	}
</style>

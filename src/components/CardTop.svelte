<script>
	import { DexrnSite } from '$lib/DexrnSite';
	import Card from './Card.svelte';
	import { t } from 'svelte-i18n';
</script>

<Card on:click={DexrnSite.back} style="cursor: pointer;">
	<p class="text">{$t('cardTop.goBack', { values: { back: $t('common.back') } })}</p>
</Card>

<style>
	.text:hover {
		opacity: 1;
	}

	.text {
		font-family: monospace;
		padding: 0;
		margin: 0;
		color: var(--prim-text-color);
		transition: opacity 0.2s ease;
		font-size: 12px;
		opacity: 0.5;
		user-select: none;
	}
</style>

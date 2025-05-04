<script lang="ts">
	import { DexrnSite } from '$lib/DexrnSite';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';

	export let id: string;
	export let onChange: (value: boolean) => void = (): void => {};

	let input: HTMLInputElement;

	function toggle() {
		onChange(input.checked); // TODO: pass event instead of checked state
		if (DexrnSite.settings) DexrnSite.settings.set(id, input.checked);
	}

	onMount(() => {
		const res = DexrnSite.settings.get<boolean>(id);

		if (typeof res === 'boolean') input.checked = res;
	});
</script>

<div class="setting">
	<input type="checkbox" {id} name={id} bind:this={input} on:change={toggle} />
	<label for={id} title={$t(`settings.${id}.info`)} class="lb">
		{$t(`settings.${id}.title`)}
	</label>
</div>

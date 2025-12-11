<script lang="ts">
	import { DexrnSite } from '$lib/DexrnSite';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';

	export let id: string;
	export let onChange: (value: boolean) => void = (): void => {
	};

	let input: HTMLInputElement;

	function toggle() {
		onChange(input.checked); // TODO: pass event instead of checked state
		if (DexrnSite.instance.settings) DexrnSite.instance.settings.set(id, input.checked);
	}

	onMount(() => {
		const res = DexrnSite.instance.settings.get<boolean>(id);

		if (typeof res === 'boolean') input.checked = res;
	});
</script>

<div class="setting">
	<input bind:this={input} {id} name={id} on:change={toggle} type="checkbox" />
	<label class="lb" for={id} title={$t(`settings.${id}.info`)}>
		{$t(`settings.${id}.title`)}
	</label>
</div>

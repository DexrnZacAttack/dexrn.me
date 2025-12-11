<script>
	export let value = 0;
	export let max = 100;
	export let color = '#3077FF';

	export let barStyle = '';
</script>

<div class="prog" {...$$restProps}>
	<div class="bar" style="width: {value / max * 100}%; background-color: {color};{barStyle}"></div>
</div>

<style>
    .prog {
        border-radius: 10px;
    }

    .bar {
        position: relative;
        height: 100%;
        transition: width 0.3s ease;
    }
</style>
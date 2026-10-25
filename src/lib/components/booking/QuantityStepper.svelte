<script lang="ts">
	let {
		value,
		min = 0,
		max,
		labelledby,
		onchange
	}: { value: number; min?: number; max: number; labelledby: string; onchange: (value: number) => void } = $props();
</script>

<div class="stepper" role="group" aria-labelledby={labelledby}>
	<button type="button" aria-label="Decrease" aria-disabled={value <= min} onclick={() => value > min && onchange(value - 1)}>
		<span class="material-icons" aria-hidden="true">remove</span>
	</button>
	<output aria-live="polite">{value}</output>
	<button type="button" aria-label="Increase" aria-disabled={value >= max} onclick={() => value < max && onchange(value + 1)}>
		<span class="material-icons" aria-hidden="true">add</span>
	</button>
</div>

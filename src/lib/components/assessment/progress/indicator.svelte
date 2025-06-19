<script module>
	type IndicatorType = 'skipped' | 'correct' | 'incorrect' | 'notAttempted';
	type IndicatorProps = {
		type: IndicatorType;
		onclick?: () => void;
		withTooltip?: boolean;
	};
</script>

<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';

	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import CheckMarkSolid from 'virtual:icons/heroicons-solid/check-circle';
	import CrossMarkSolid from 'virtual:icons/heroicons-solid/x-circle';

	const lights = {
		skipped: '#808080',
		correct: '#28c940',
		error: '#ff5f57',
		notAttempted: '#ffbd2e'
	};

	let { type, onclick = () => {}, withTooltip = false }: IndicatorProps = $props();

	function getColor(type: 'notAttempted' | 'skipped' | 'correct' | 'incorrect'): string {
		switch (type) {
			case 'skipped':
				return lights.skipped;
			case 'correct':
				return lights.correct;
			case 'incorrect':
				return lights.error;
			default:
				return lights.notAttempted;
		}
	}

	const color = $derived.by(() => getColor(type));
	const toolTipText = $derived.by(() => {
		switch (type) {
			case 'skipped':
				return 'Skipped';
			case 'correct':
				return 'Correct';
			case 'incorrect':
				return 'Incorrect';
			default:
				return 'Not Attempted';
		}
	});
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<button
	id="indicator-{type}"
	{onclick}
	class={[
		'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full p-1 shadow-inner hover:brightness-125',
		color === lights.notAttempted && 'border-4 border-gray-400'
	]}
	style="background-color: {color || lights.notAttempted};"
>
	{#if color === lights.skipped}
		<ChevronRightOutline size="xl" strokeWidth="3" class="ml-0.5 text-8xl text-white" />
	{/if}
	{#if color === lights.correct}
		<CheckMarkSolid class="h-full w-full text-green-100" />
	{/if}
	{#if color === lights.error}
		<CrossMarkSolid class="h-full w-full text-red-100" />
	{/if}
</button>
{#if withTooltip}
	<Tooltip>{toolTipText}</Tooltip>
{/if}

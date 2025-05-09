<script lang="ts">
	import type { MultipleChoiceOption } from '$lib/services/models';
	import { Radio } from 'flowbite-svelte';

	let {
		options
	}: {
		options: MultipleChoiceOption[];
	} = $props();
</script>

{#each options as option}
	<div class="mb-2 flex flex-row items-center gap-2">
		<Radio name="option" value={option.value} class="text-lg">{option.value}</Radio>
	</div>
{/each}

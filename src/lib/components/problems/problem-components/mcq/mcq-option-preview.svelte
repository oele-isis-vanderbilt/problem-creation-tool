<script lang="ts">
	import {
		MCQOptionKind,
		ProblemKind,
		type MCQProblemRunState,
		type MultipleChoiceOption
	} from '$lib/services/models';
	import { Button } from 'flowbite-svelte';
	import Text from './mcq-options/text.svelte';
	import Image from './mcq-options/image.svelte';
	import Fraction from './mcq-options/fraction.svelte';
	import { onMount } from 'svelte';

	let {
		options,
		selectedOptionId = $bindable(null)
	}: {
		options: MultipleChoiceOption[];
		selectedOptionId?: string | null;
	} = $props();

	let isSelectedOption = $derived.by(() => {
		return (id: string) => {
			return selectedOptionId === id;
		};
	});

	onMount(() => {
		selectedOptionId = null;
	});
</script>

<div class="mb-4 grid w-full grid-cols-1 justify-between gap-4 lg:grid-cols-2">
	{#each options as option}
		{#if option.kind === MCQOptionKind.TEXT}
			<Button
				class="text-lg"
				outline={!isSelectedOption(option.id)}
				color="gray"
				size="lg"
				onclick={() => (selectedOptionId = option.id)}
			>
				<Text mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.FRACTION}
			<Button
				class="text-lg"
				outline={!isSelectedOption(option.id)}
				color="gray"
				size="lg"
				onclick={() => (selectedOptionId = option.id)}
			>
				<Fraction mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.IMAGE}
			<Button
				class="text-lg"
				color="gray"
				size="lg"
				outline={!isSelectedOption(option.id)}
				onclick={() => (selectedOptionId = option.id)}
			>
				<Image mode="preview" {option} />
			</Button>
		{/if}
	{/each}
</div>

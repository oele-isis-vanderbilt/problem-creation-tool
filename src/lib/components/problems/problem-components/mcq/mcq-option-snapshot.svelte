<script lang="ts">
	import { MCQOptionKind, type MultipleChoiceOption } from '$lib/services/models';
	import { Button, type ButtonProps } from 'flowbite-svelte';
	import Text from './mcq-options/text.svelte';
	import Image from './mcq-options/image.svelte';
	import Fraction from './mcq-options/fraction.svelte';

	let {
		options,
		selectedOptionId = null
	}: {
		options: MultipleChoiceOption[];
		selectedOptionId?: string | null;
	} = $props();

	let isSelectedOption = $derived.by(() => {
		return (id: string) => {
			return selectedOptionId === id;
		};
	});

	let selectedOption = $derived.by(() => {
		return options.find((option) => option.id === selectedOptionId) || null;
	});

	let correctOption = $derived.by(() => {
		return options.find((option) => option.isCorrect) || null;
	});

	function getOptionColor(option: MultipleChoiceOption): ButtonProps['color'] {
		if (option.isCorrect) {
			return 'green';
		} else if (isSelectedOption(option.id)) {
			return 'red';
		}
		return 'gray';
	}

	function getOptionComponent(kind: MCQOptionKind) {
		switch (kind) {
			case MCQOptionKind.TEXT:
				return Text;
			case MCQOptionKind.IMAGE:
				return Image;
			case MCQOptionKind.FRACTION:
				return Fraction;
			default:
				throw new Error(`Unknown option kind: ${kind}`);
		}
	}
</script>

<div class="mb-4 grid w-full grid-cols-1 justify-between gap-4 lg:grid-cols-2">
	{#each options as option}
		{#if option.kind === MCQOptionKind.TEXT}
			<Button disabled class="text-lg" color={getOptionColor(option)} size="lg">
				<Text mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.FRACTION}
			<Button class="text-lg" disabled color={getOptionColor(option)} size="lg">
				<Fraction mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.IMAGE}
			<Button class="text-lg" disabled color={getOptionColor(option)} size="lg">
				<Image mode="preview" {option} />
			</Button>
		{/if}
	{/each}
</div>

{#if selectedOption}
	{@const OptionComponent = getOptionComponent(selectedOption.kind)}
	{#if selectedOption.isCorrect}
		<div class="flex-col gap-2 rounded-lg bg-green-600 p-4 text-white">
			<p class="text-lg font-semibold">Well Done!!</p>
			<OptionComponent mode="preview" option={selectedOption} />
			<p class="text-sm">This option is correct for the problem, as you selected</p>
		</div>
	{:else}
		<div class="flex-col gap-2 rounded-lg bg-red-600 p-4 text-white">
			<p class="text-lg font-semibold">Incorrect Option, You Selected</p>
			<OptionComponent mode="preview" option={selectedOption} />
			<p class="text-sm">This option is incorrect for the problem.</p>
			{#if correctOption}
				<p class="text-sm">The correct option is:</p>
				<OptionComponent mode="preview" option={correctOption} />
			{/if}
		</div>
	{/if}
{:else}
	{@const OptionComponent = getOptionComponent(correctOption?.kind || MCQOptionKind.TEXT)}
	{#if correctOption}
		<div class="flex-col gap-2 rounded-lg bg-yellow-600 p-4 text-white">
			<p class="text-lg font-semibold">No Option Selected</p>
			<p class="text-sm">The correct option is:</p>
			<OptionComponent mode="preview" option={correctOption} />
		</div>
	{/if}
{/if}

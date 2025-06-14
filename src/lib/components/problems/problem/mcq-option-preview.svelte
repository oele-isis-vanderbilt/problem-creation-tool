<script lang="ts">
	import { MCQOptionKind, type MultipleChoiceOption } from '$lib/services/models';
	import { Button, Radio } from 'flowbite-svelte';
	import Text from '$lib/components/problems/problem/mcq-options/text.svelte';
	import Image from '$lib/components/problems/problem/mcq-options/image.svelte';
	import Fraction from '$lib/components/problems/problem/mcq-options/fraction.svelte';

	let {
		options,
		showGradingFeedbackErrors = false,
		onGradingStateChange = (state) => {}
	}: {
		options: MultipleChoiceOption[];
		showGradingFeedbackErrors?: boolean;
		onGradingStateChange?: (state: {
			can: boolean;
			errors: string[];
			selectedOptionId: string | null;
		}) => void;
	} = $props();

	let selectedOptionId = $state<string | null>(null);

	let validationErrors = $derived.by(() => {
		const errors: string[] = [];
		if (selectedOptionId === null) {
			errors.push('No option selected');
		}

		return errors;
	});

	$effect(() => {
		const canGrade = validationErrors.length === 0;
		onGradingStateChange({
			can: canGrade,
			errors: validationErrors,
			selectedOptionId: selectedOptionId
		});
	});
</script>

<div class="grid grid-cols-2 gap-4">
	{#each options as option}
		<div class="mb-2 flex flex-row items-center justify-center gap-2">
			{#if option.kind === MCQOptionKind.TEXT}
				<Button color="green" class="w-full text-gray-800" outline name="option" onclick={() => (selectedOptionId = option.id)}>
					<Text mode="preview" {option} />
				</Button>
			{:else if option.kind === MCQOptionKind.FRACTION}
				<Radio name="option" value={option.id} class="text-lg" bind:group={selectedOptionId}>
					<Fraction mode="preview" {option} />
				</Radio>
			{:else if option.kind === MCQOptionKind.IMAGE}
				<Radio name="option" value={option.id} class="text-lg" bind:group={selectedOptionId}>
					<Image mode="preview" {option} />
				</Radio>
			{/if}
		</div>
	{/each}
</div>
{#if showGradingFeedbackErrors && validationErrors.length > 0}
	<div
		class="mb-2 w-full rounded-lg border-2 border-red-200 bg-red-200 p-2 text-red-600 dark:border-red-400 dark:bg-red-400 dark:text-white"
	>
		<span class="font-bold">Please correct the errors below</span>
		{#each validationErrors as error}
			<p>{error}</p>
		{/each}
	</div>
{/if}

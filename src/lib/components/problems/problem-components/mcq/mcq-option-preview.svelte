<script lang="ts">
	import { MCQOptionKind, type MultipleChoiceOption } from '$lib/services/models';
	import { Button, Radio } from 'flowbite-svelte';
	import Text from './mcq-options/text.svelte';
	import Image from './mcq-options/image.svelte';
	import Fraction from './mcq-options/fraction.svelte';

	let {
		options
	}: {
		options: MultipleChoiceOption[];
	} = $props();
</script>

<div class="mb-2 grid w-full grid-cols-1 justify-between gap-4 lg:grid-cols-2">
	{#each options as option}
		{#if option.kind === MCQOptionKind.TEXT}
			<Button class="text-lg" outline color="gray" size="lg">
				<Text mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.FRACTION}
			<Button class="text-lg" outline color="gray" size="lg">
				<Fraction mode="preview" {option} />
			</Button>
		{:else if option.kind === MCQOptionKind.IMAGE}
			<Button class="text-lg" outline color="gray" size="lg">
				<Image mode="preview" {option} />
			</Button>
		{/if}
	{/each}
</div>

<script lang="ts">
	import { MCQOptionKind, type MultipleChoiceOption } from '$lib/services/models';
	import { Radio } from 'flowbite-svelte';
	import Text from './mcq-options/text.svelte';
	import Image from './mcq-options/image.svelte';
	import Fraction from './mcq-options/fraction.svelte';

	let {
		options
	}: {
		options: MultipleChoiceOption[];
	} = $props();
</script>

{#each options as option}
	<div class="mb-2 flex flex-row items-center justify-center gap-2">
		{#if option.kind === MCQOptionKind.TEXT}
			<Radio name="option" value={option.id} class="text-lg">
				<Text mode="preview" {option} />
			</Radio>
		{:else if option.kind === MCQOptionKind.FRACTION}
			<Radio name="option" value={option.id} class="text-lg">
				<Fraction mode="preview" {option} />
			</Radio>
		{:else if option.kind === MCQOptionKind.IMAGE}
			<Radio name="option" value={option.id} class="text-lg">
				<Image mode="preview" {option} />
			</Radio>
		{/if}
	</div>
{/each}

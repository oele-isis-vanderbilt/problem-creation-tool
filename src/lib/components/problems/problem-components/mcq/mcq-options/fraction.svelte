<script lang="ts">
	import type { MultipleChoiceOptionFraction } from '$lib/services/models';
	import { Hr, Input } from 'flowbite-svelte';
	import { getMathJAXFraction } from '$lib/utils';
	import MathJax from '$lib/components/problems/Mathjax.svelte';

	let {
		option = $bindable(),
		mode = 'edit'
	}: {
		option: MultipleChoiceOptionFraction;
		mode: 'edit' | 'preview';
	} = $props();

	let fraction = getMathJAXFraction(option.numerator, option.denominator, option.wholeNumber);
</script>

{#if mode === 'preview'}
	<MathJax math={fraction} />
{:else}
	<div class="flex flex-row items-center justify-between gap-2">
		<Input
			class="w-16"
			id="value"
			required
			type="text"
			bind:value={option.wholeNumber}
			placeholder="W"
		/>
		<div class="flex flex-col gap-2">
			<Input
				id="numerator"
				required
				type="text"
				bind:value={option.numerator}
				placeholder="N"
				class="w-16"
			/>
			<Hr class="my-1" />
			<Input
				id="denominator"
				required
				type="text"
				bind:value={option.denominator}
				placeholder="D"
				class="w-16"
			/>
		</div>
	</div>
{/if}

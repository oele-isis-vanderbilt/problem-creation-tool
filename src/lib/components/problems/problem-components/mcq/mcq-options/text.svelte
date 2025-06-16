<script lang="ts">
	import type { MultipleChoiceOptionText } from '$lib/services/models';
	import { Input, Radio } from 'flowbite-svelte';

	let {
		option = $bindable(),
		mode = 'edit'
	}: {
		option: MultipleChoiceOptionText;
		mode: 'edit' | 'preview';
	} = $props();
</script>

{#if mode === 'preview'}
	{option.value}
{:else}
	<Input id="value" required type="text" bind:value={option.value} placeholder="Option Value" />
{/if}

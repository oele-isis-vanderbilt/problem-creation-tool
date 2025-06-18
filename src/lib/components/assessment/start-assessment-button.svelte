<script lang="ts">
	import type { StateAssessment } from '$lib/services/models';
	import { Button } from 'flowbite-svelte';
	import HeroiconsPlayCircle16Solid from 'virtual:icons/heroicons-solid/play';
	import SequenceWrapper from './sequence-wrapper.svelte';

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();

	let started = $state<boolean>(false);
</script>

<Button onclick={() => (started = !started)} class="gap-2">
	Start
	<HeroiconsPlayCircle16Solid />
</Button>

{#if started}
	<div class="bg-primary-200 dark:bg-secondary-800 absolute inset-20">
		<SequenceWrapper {assessment} />
	</div>
{/if}

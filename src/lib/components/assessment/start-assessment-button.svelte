<script lang="ts">
	import type { StateAssessment } from '$lib/services/models';
	import { Button } from 'flowbite-svelte';
	import HeroiconsPlayCircle16Solid from 'virtual:icons/heroicons-solid/play';

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();
</script>

<Button onclick={() => {}} class="gap-2">
	Start
	<HeroiconsPlayCircle16Solid />
</Button>

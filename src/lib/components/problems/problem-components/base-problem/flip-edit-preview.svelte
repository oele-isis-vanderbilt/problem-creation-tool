<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	import HeroIconsEye20Solid from 'virtual:icons/heroicons-solid/eye';
	import Pencil from 'virtual:icons/heroicons-solid/pencil';

	let isEdit = $state(true);

	const { edit, preview }: { edit: Snippet; preview: Snippet } = $props();

	const icons = {
		edit: Pencil,
		preview: HeroIconsEye20Solid
	};
</script>

{#snippet icon(name: 'preview' | 'edit')}
	{@const Component = icons[name]}
	<div>
		<button onclick={() => (isEdit = !isEdit)} class="p-2">
			<Component class="h-6 w-6 text-gray-500 hover:text-gray-700" />
		</button>
		<Tooltip placement="right">
			{name === 'preview' ? 'Preview' : 'Edit'}
		</Tooltip>
	</div>
{/snippet}

<div class="relative mt-5 h-full w-full">
	<div class="absolute top-0 right-0 -mt-10">
		{@render icon(isEdit ? 'preview' : 'edit')}
	</div>

	{#if isEdit}
		<div class="h-full w-full" transition:fly={{ y: 100, duration: 200 }}>
			{@render edit()}
		</div>
	{:else}
		<div class="h-full w-full" transition:fly={{ y: 100, duration: 200 }}>
			{@render preview()}
		</div>
	{/if}
</div>

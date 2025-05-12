<script lang="ts">
	import { Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { ProblemKind } from '$lib/services/models';

	let isDropdownOpen = $state(false);

	let { onProblemKindSelected } = $props<{
		onProblemKindSelected: (kind: ProblemKind) => void;
	}>();
</script>

<Button>Add a Problem<ChevronDownOutline /></Button>
<Dropdown bind:isOpen={isDropdownOpen} simple>
	{#each Object.values(ProblemKind) as value}
		<DropdownItem
			onclick={() => {
				onProblemKindSelected(value);
				isDropdownOpen = !isDropdownOpen;
			}}
		>
			{value}
		</DropdownItem>
		<DropdownDivider />
	{/each}
</Dropdown>

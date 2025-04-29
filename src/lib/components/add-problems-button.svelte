<script lang="ts">
	import { Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let isDropdownOpen = $state(false);
</script>

<Button
	class="gap-2 rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:text-white"
	>Add a Problem<ChevronDownOutline class="ms-2 h-6 w-6 text-black dark:text-white " /></Button
>
<Dropdown bind:open={isDropdownOpen}>
	<DropdownItem onclick={() => (isDropdownOpen = !isDropdownOpen)}>Multiple Choice</DropdownItem>
	<DropdownDivider />
	<DropdownItem onclick={() => (isDropdownOpen = !isDropdownOpen)}>Word Problem</DropdownItem>
</Dropdown>

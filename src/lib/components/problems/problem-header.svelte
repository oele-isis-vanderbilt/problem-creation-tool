<script lang="ts">
	import type { ProblemKind } from '$lib/services/models';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
	import { Clipboard } from 'flowbite-svelte';
	import { CheckOutline, ClipboardCleanSolid } from 'flowbite-svelte-icons';
	import { prependBaseUrl } from '$lib/utils';

	let {
		id,
		title,
		lastUpdated,
		kind,
		noTitlePlaceHolder = 'Click to add title...',
		hasDeleteButton = true,
		hasErrors = false,
		onProblemDeleted
	}: {
		id: string;
		title: string;
		lastUpdated: string;
		hasErrors?: boolean;
		noTitlePlaceHolder?: string;
		kind: ProblemKind;
		hasDeleteButton?: boolean;
		onProblemDeleted: () => void;
	} = $props();

	function getProblemUrl() {
		return window.location.origin + prependBaseUrl(`/${id}`);
	}
</script>

<div class="flex h-full w-full items-center justify-between">
	<h2 class="flex-1 text-lg">
		{title || noTitlePlaceHolder}
	</h2>
	<div class="flex items-center justify-between">
		<span class="text-sm text-gray-500 dark:text-gray-400">
			<span class="text-red-800 dark:text-red-500">{hasErrors ? '(Needs Review)' : ''} </span>
			{kind} | Last Updated: {lastUpdated}
		</span>
		<div class="mr-2 flex flex-row items-center justify-center gap-2">
			{#if hasDeleteButton}
				<HeroIconsTrash
					class="m-2 hover:text-red-500"
					onclick={(event: Event) => {
						event.stopPropagation();
						onProblemDeleted();
					}}
				></HeroIconsTrash>
			{/if}
			<Clipboard
				size="xs"
				color="alternative"
				onclick={(event) => event.stopPropagation()}
				value={getProblemUrl()}
				class="-mr-1 w-20 focus:ring-0"
			>
				{#snippet children(success)}
					{#if success}
						<CheckOutline class="h-3 w-3" />
					{:else}
						<ClipboardCleanSolid class="h-3 w-3" />
					{/if}
				{/snippet}
			</Clipboard>
		</div>
	</div>
</div>

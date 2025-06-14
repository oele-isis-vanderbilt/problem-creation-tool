<script lang="ts">
	import AddEditConcept from '$lib/components/concept/add-edit-concept.svelte';
	import AddEditMisconception from '$lib/components/concept/add-edit-misconception.svelte';
	import ConceptHeader from '$lib/components/concept/concept-misconception-header.svelte';
	import { store } from '$lib/services/modules-store.svelte';
	import type { Concept, Misconception } from '$lib/services/models';
	import { paginate } from '$lib/utils';
	import { Button, Listgroup, ListgroupItem, Pagination } from 'flowbite-svelte';
	import { emptyConcept, emptyMisconception } from '$lib/utils';

	const MisconceptionHeader = ConceptHeader;

	const { getConceptsFn, getMisconceptionsFn } = store!;

	const PAGE_SIZE = 5;

	const pagedConcepts = $derived.by(() => {
		const concepts = getConceptsFn()();
		return paginate(Object.values(concepts), PAGE_SIZE);
	});

	const pagedMisconceptions = $derived.by(() => {
		const misconceptions = getMisconceptionsFn()();
		return paginate(Object.values(misconceptions), PAGE_SIZE);
	});

	let currentConceptPageNo = $state(0);
	let currentMisconceptionPageNo = $state(0);

	let isConceptAdderOpen = $state(false);
	let isMisconceptionAdderOpen = $state(false);
	let conceptAdderPreviewOnly = $state(false);
	let misconceptionAdderPreviewOnly = $state(false);

	let currentConcept = $state<Concept>(emptyConcept());
	let currentMisconception = $state<Misconception>(emptyMisconception());

	function nextConceptPage() {
		if (currentConceptPageNo < pagedConcepts.length - 1) {
			currentConceptPageNo += 1;
		}
	}

	function prevConceptPage() {
		if (currentConceptPageNo > 0) {
			currentConceptPageNo -= 1;
		}
	}

	function onConceptPageChange(event: Event) {
		let page = 1;
		page = parseInt((event.target as HTMLElement).innerText);
		if (!Number.isNaN(page)) {
			currentConceptPageNo = page - 1;
		}
	}

	function onMisconceptionPageChange(event: Event) {
		let page = 1;
		page = parseInt((event.target as HTMLElement).innerText);
		if (!Number.isNaN(page)) {
			currentMisconceptionPageNo = page - 1;
		}
	}

	function nextMisconceptionPage() {
		if (currentMisconceptionPageNo < pagedMisconceptions.length - 1) {
			currentMisconceptionPageNo += 1;
		}
	}

	function prevMisconceptionPage() {
		if (currentMisconceptionPageNo > 0) {
			currentMisconceptionPageNo -= 1;
		}
	}

	const { flowBiteConceptPageItems, flowBiteMisConceptionItems } = $derived.by(() => {
		currentConceptPageNo;
		currentMisconceptionPageNo;

		const getPagesItems = (pagedItems, currentPageNo) => {
			const pagesToShow = 5;
			if (pagedItems.length <= pagesToShow) {
				return Array.from({ length: pagedItems.length }, (_, i) => ({
					name: i + 1,
					active: i === currentPageNo
				}));
			}

			const start = Math.max(0, currentPageNo - Math.floor(pagesToShow / 2));
			const end = Math.min(pagedItems.length, start + pagesToShow);
			return Array.from({ length: end - start }, (_, i) => ({
				name: start + i + 1,
				active: start + i === currentPageNo
			}));
		};

		const pages = {
			flowBiteConceptPageItems: getPagesItems(pagedConcepts, currentConceptPageNo),
			flowBiteMisConceptionItems: getPagesItems(pagedMisconceptions, currentMisconceptionPageNo)
		};

		return pages;
	});
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col">
	<div class="mb-3 flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Concepts</h2>
		<Button
			onclick={() => {
				isConceptAdderOpen = true;
			}}
		>
			Add new concept
		</Button>
	</div>
	<Listgroup class="mb-5 w-full">
		{#each pagedConcepts[currentConceptPageNo] as concept}
			<ListgroupItem class="py-2">
				<ConceptHeader
					name={concept.name}
					onEdit={() => {
						currentConcept = concept;
						isConceptAdderOpen = true;
						conceptAdderPreviewOnly = false;
					}}
					onInfo={() => {
						currentConcept = concept;
						isConceptAdderOpen = true;
						conceptAdderPreviewOnly = true;
					}}
				/>
			</ListgroupItem>
		{/each}
	</Listgroup>

	{#if pagedConcepts.length > 1}
		<div class="flex w-full items-center justify-center">
			<Pagination
				class="mb-5"
				pages={flowBiteConceptPageItems}
				next={nextConceptPage}
				previous={prevConceptPage}
				onclick={(p) => onConceptPageChange(p)}
			/>
		</div>
	{/if}

	<div class="mb-3 flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Misconceptions</h2>
		<Button
			onclick={() => {
				isMisconceptionAdderOpen = !isMisconceptionAdderOpen;
			}}
		>
			Add new misconception
		</Button>
	</div>

	<Listgroup class="mb-5 w-full">
		{#each pagedMisconceptions[currentMisconceptionPageNo] as misconception}
			<ListgroupItem class="py-2">
				<MisconceptionHeader
					name={misconception.name}
					onEdit={() => {
						currentMisconception = misconception;
						isMisconceptionAdderOpen = true;
						misconceptionAdderPreviewOnly = false;
					}}
					onInfo={() => {
						currentMisconception = misconception;
						isMisconceptionAdderOpen = true;
						misconceptionAdderPreviewOnly = true;
					}}
				/>
			</ListgroupItem>
		{/each}
	</Listgroup>
	{#if pagedMisconceptions.length > 1}
		<div class="flex w-full items-center justify-center">
			<Pagination
				class="mb-5"
				pages={flowBiteMisConceptionItems}
				next={nextMisconceptionPage}
				previous={prevMisconceptionPage}
				onclick={(p) => onMisconceptionPageChange(p)}
			/>
		</div>
	{/if}
</div>

<AddEditMisconception
	open={isMisconceptionAdderOpen}
	previewOnly={misconceptionAdderPreviewOnly}
	bind:currentMisconception={currentMisconception!}
	onClose={() => {
		isMisconceptionAdderOpen = false;
		misconceptionAdderPreviewOnly = false;
		currentMisconception = emptyMisconception();
	}}
/>
<AddEditConcept
	open={isConceptAdderOpen}
	previewOnly={conceptAdderPreviewOnly}
	bind:currentConcept={currentConcept!}
	onClose={() => {
		isConceptAdderOpen = false;
		conceptAdderPreviewOnly = false;
		currentConcept = emptyConcept();
	}}
/>

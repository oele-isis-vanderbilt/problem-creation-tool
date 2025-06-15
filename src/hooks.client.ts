import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	const { initialize } = await import('$lib/services/knowLearningStore.svelte');
	const { initProblemStore } = await import('$lib/services/problem-store.svelte');
	const problemStore = await initProblemStore();
	await initialize(problemStore);
};

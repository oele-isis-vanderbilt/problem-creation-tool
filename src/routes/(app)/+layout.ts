import type { LayoutLoad } from './$types';
export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async () => {
    const { initialize, getEnvironment } = await import('$lib/services/knowLearningStore.svelte');
	const { initProblemStore } = await import('$lib/services/problem-store.svelte');
	const problemStore = await initProblemStore();
	await initialize(problemStore);
	const env = await getEnvironment();
	return {
		env
	};
};

import type { ClientInit } from '@sveltejs/kit';

function isUUID(str: string): boolean {
	const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
	return uuidRegex.test(str);
}

export const init: ClientInit = async () => {
	const pathName = window.location.pathname;
	if (!isUUID(pathName.replace(/^\//, ''))) {
		console.log('Initializing KnowLearning Store');
		const { initialize } = await import('$lib/services/knowLearningStore.svelte');
		const { initProblemStore } = await import('$lib/services/problem-store.svelte');
		const problemStore = await initProblemStore();
		await initialize(problemStore);
	}
};

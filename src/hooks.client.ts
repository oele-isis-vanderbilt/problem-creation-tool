import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	const { initialize } = await import('$lib/services/modules-store.svelte');
	await initialize();
};

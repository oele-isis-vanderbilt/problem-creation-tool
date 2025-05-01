import type { LayoutLoad } from './$types';
export const ssr = false;

export const load: LayoutLoad = async () => {
	const { initialize, getEnvironment } = await import('$lib/services/knowLearing.svelte');

	await initialize();
	const env = await getEnvironment();
	return {
		env
	};
};

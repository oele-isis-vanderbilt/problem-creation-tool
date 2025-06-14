import type { LayoutLoad } from './$types';
export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async () => {
	const { getEnvironment } = await import('$lib/services/modules-store.svelte');
	const env = await getEnvironment();
	return {
		env
	};
};

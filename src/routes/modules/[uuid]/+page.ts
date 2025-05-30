import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const { store } = await import('$lib/services/modules-store.svelte');

	const module = store!.getModule(params.uuid);

	if (!module) {
		error(404, `Module with id ${params.uuid} not found`);
	}
	return {
		module: {
			id: params.uuid
		}
	};
};

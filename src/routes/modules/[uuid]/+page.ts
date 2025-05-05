import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const { getModule } = await import('$lib/services/knowLearing.svelte');

	const module = getModule(params.uuid);

	if (!module) {
		error(404, `Module with id ${params.uuid} not found`);
	}
	return {
		module: {
			id: params.uuid
		}
	};
};

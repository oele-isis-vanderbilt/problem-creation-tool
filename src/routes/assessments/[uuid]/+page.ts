import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const { store } = await import('$lib/services/knowLearningStore.svelte');

	const assessment = store!.assessmentExists(params.uuid);

	if (!assessment) {
		error(404, `Module with id ${params.uuid} not found`);
	}
	return {
		assessment: {
			id: params.uuid
		}
	};
};

import type { ProblemAttempt } from '$lib/services/models';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';


export const load: PageLoad = async ({ params }) => {
	const { store } = await import('$lib/services/modules-store.svelte');

	const problem = store!.getProblem(params.uuid);
	if (!problem) {
		error(404, `Problem with id ${params.uuid} not found`);
	}
	return {
		problem,
		uuid: params.uuid,
		runState: (await store!.getRunState(params.uuid)) as ProblemAttempt
	};
};

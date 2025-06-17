import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { store: problemStore } = await import('$lib/services/problem-store.svelte');
	const { validateProblem } = await import('$lib/components/problems/problem-components/utils');

	const uuid = params.uuid;
	if (!problemStore) {
		error(500, 'Problem store is not initialized');
	}

	const problem = problemStore.getProblem(uuid);
	if (!problem) {
		error(404, `Problem with id ${uuid} not found`);
	}

	let errors = validateProblem(problem);
	if (errors.length > 0) {
		error(400, {
			message: `Problem validation failed: ${errors.join(', ')}`,
			errors: errors,
			title: 'Problem Validation Error'
		});
	}

	let runState = await problemStore.getProblemRunState(uuid);

	return {
		problem,
		runState
	};
};

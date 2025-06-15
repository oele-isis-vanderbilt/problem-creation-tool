import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import validateProblem from '$lib/components/problems/problem/questionValidator';

export const load: PageLoad = async ({ params }) => {
	const { store: problemStore } = await import('$lib/services/problem-store.svelte');
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
		error(400, `The problem is invalid: ${errors.join(', ')}`);
	}

	return {
		problem
	};
};

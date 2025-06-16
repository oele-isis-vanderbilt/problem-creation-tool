import type { Problem } from '$lib/services/models';

export default function validateProblem(problem: Problem) {
	let errors: string[] = [];
	if (!problem.title) {
		errors.push('Problem title is required');
	}

	if (problem.concepts.length === 0) {
		errors.push('At least one concept is required for the problem');
	}
	return errors;
}

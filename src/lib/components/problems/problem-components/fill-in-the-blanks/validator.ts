import type { FillInTheBlankProblem } from '$lib/services/models';

export default function validateProblem(problem: FillInTheBlankProblem) {
	let errors: string[] = [];

	if (!problem.blanks || Object.keys(problem.blanks).length === 0) {
		errors.push('At least one blank must be defined');
	}

	return errors;
}

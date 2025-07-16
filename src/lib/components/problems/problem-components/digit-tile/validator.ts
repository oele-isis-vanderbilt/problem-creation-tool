import type { DigitTileProblem } from '$lib/services/models';

export default function validateProblem(problem: DigitTileProblem) {
	let errors: string[] = [];
	if (!problem.operator) {
		errors.push('Operator is required');
	}

	if (!problem.tiles || problem.tiles.length < 2) {
		errors.push('At least two tiles are required');
	} else if (problem.tiles.some((tile) => typeof tile !== 'number')) {
		errors.push('All tiles must be numbers');
	}

	let allTermsLength = problem.terms.reduce((sum, term) => sum + term.digitSlots, 0);

	if (allTermsLength !== problem.tiles.length) {
		errors.push(
			`Total digit slots in terms (${allTermsLength}) must match the number of tiles (${problem.tiles.length})`
		);
	}

	return errors;
}

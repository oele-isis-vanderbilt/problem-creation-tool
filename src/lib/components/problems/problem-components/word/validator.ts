import type { WordProblem } from '$lib/services/models';

export default function validateProblem(problem: WordProblem): string[] {
	let errors: string[] = [];

	if (problem.answerBlocks.length === 0) {
		errors.push('At least one answer block is required for the word problem');
	}

	if (
		problem.answerBlocks.some((block) => {
			if (block.hasOwnProperty('label') && block.label === '') {
				return true;
			}
			return false;
		})
	) {
		errors.push('All answer blocks with labels must have a label');
	}

	if (!problem.answerBlocks.every((block) => !!block.value)) {
		errors.push('All answer blocks must have a value');
	}

	return errors;
}

import type { MultipleChoiceProblem } from '$lib/services/models';

export default function validateMCQ(problem: MultipleChoiceProblem) {
	let errors: string[] = [];
	if (!problem.title) {
		errors.push('Title is required');
	}
	if (problem.concepts.length === 0) {
		errors.push('At least one concept is required');
	}

	if (problem.options.length < 2) {
		errors.push('At least two options are required');
	}

	if (problem.options.find((option) => option.isCorrect) === undefined) {
		errors.push('At least one option must be correct');
	}

	const allOptionValues = problem.options.filter((option) => !option.value);

	if (allOptionValues.length > 0) {
		errors.push('All options must have a value');
	}
	return errors;
}

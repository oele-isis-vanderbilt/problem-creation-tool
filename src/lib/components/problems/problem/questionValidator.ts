import { ProblemKind, type Problem } from '$lib/services/models';

export default function validateProblem(problem: Problem) {
	let errors: string[] = [];
	if (!problem.title) {
		errors.push('Title is required');
	}
	if (problem.concepts.length === 0) {
		errors.push('At least one concept is required');
	}

	if (problem.kind === ProblemKind.MULTIPLE_CHOICE) {
		if (problem.options.length < 2) {
			errors.push('At least two options are required for the multiple choice problem');
		}

		if (problem.options.find((option) => option.isCorrect) === undefined) {
			errors.push('At least one option must be correct for the multiple choice problem');
		}

		const allOptionValues = problem.options.filter((option) => !option.value);

		if (allOptionValues.length > 0) {
			errors.push('All options must have a value for the multiple choice problem');
		}
	} else if (problem.kind === ProblemKind.WORD_PROBLEM) {
		if (!problem.answer) {
			errors.push('Answer is required for the word problem');
		}
	}

	return errors;
}

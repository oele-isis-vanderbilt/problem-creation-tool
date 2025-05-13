import { MCQOptionKind, ProblemKind } from '$lib/services/models';
import type { Problem, MultipleChoiceOption } from '$lib/services/models';

let mcqOptionsValidators: Record<MCQOptionKind, (option: MultipleChoiceOption) => string[]> = {
	[MCQOptionKind.TEXT]: (option: MultipleChoiceOption) => {
		if (option.kind !== MCQOptionKind.TEXT) {
			return [];
		}
		if (!option.value) {
			return ['Text option value is required'];
		}
		return [];
	},
	[MCQOptionKind.FRACTION]: (option: MultipleChoiceOption) => {
		if (option.kind !== MCQOptionKind.FRACTION) {
			return [];
		}
		let errors: string[] = [];
		if (!option.numerator) {
			errors.push('Fraction option numerator is required');
		}
		if (!option.denominator) {
			errors.push('Fraction option denominator is required');
		}

		return errors;
	},
	[MCQOptionKind.IMAGE]: (option: MultipleChoiceOption) => {
		if (option.kind !== MCQOptionKind.IMAGE) {
			return [];
		}

		if (!option.imageUUID) {
			return ['You must upload an image for the image option'];
		}
		return [];
	}
};

export default function validateProblem(problem: Problem) {
	let errors: string[] = [];
	if (!problem.title) {
		errors.push('Problem title is required');
	}
	if (problem.concepts.length === 0) {
		errors.push('At least one concept is required for the problem');
	}

	if (problem.kind === ProblemKind.MULTIPLE_CHOICE) {
		if (problem.options.length < 2) {
			errors.push('At least two options are required for the multiple choice problem');
		}

		if (problem.options.find((option) => option.isCorrect) === undefined) {
			errors.push('At least one option must be correct for the multiple choice problem');
		}

		if (problem.options.some((option) => !option.isCorrect && !option.misconception)) {
			errors.push('All incorrect options must have a misconception');
		}

		errors.push(
			...problem.options.flatMap((option) => {
				return mcqOptionsValidators[option.kind](option);
			})
		);
	} else if (problem.kind === ProblemKind.WORD_PROBLEM) {
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
	}

	return errors;
}

import type { MultipleChoiceOption, MultipleChoiceProblem } from '$lib/services/models';
import { MCQOptionKind } from '$lib/services/models';

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

export default function validateProblem(problem: MultipleChoiceProblem) {
	let errors: string[] = [];
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
	return errors;
}

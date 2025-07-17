import MCQ from './mcq/problem.svelte';
import Word from './word/problem.svelte';
import NDigit from './ndigit/problem.svelte';
import DigitTile from './digit-tile/problem.svelte';
import {
	ProblemKind,
	type DigitTileProblem,
	type MultipleChoiceProblem,
	type NDigitOperation,
	type Problem,
	type WordProblem
} from '$lib/services/models';
import mcqValidator from './mcq/validator';
import nDigitValidator from './ndigit/validator';
import baseValidator from './base-problem/validator';
import wordProblemValidator from './word/validator';
import digitTileValidator from './digit-tile/validator';

export function getProblemComponent(kind: ProblemKind) {
	switch (kind) {
		case ProblemKind.MULTIPLE_CHOICE:
			return MCQ;
		case ProblemKind.WORD_PROBLEM:
			return Word;
		case ProblemKind.N_DIGIT_OPERATION:
			return NDigit;
		case ProblemKind.DIGIT_TILE_PROBLEM:
			return DigitTile;
	}
}

export function validateProblem(problem: Problem): string[] {
	const validators = [
		baseValidator,
		...(problem.kind === ProblemKind.MULTIPLE_CHOICE
			? [(p: Problem) => mcqValidator(p as MultipleChoiceProblem)]
			: []),
		...(problem.kind === ProblemKind.WORD_PROBLEM
			? [(p: Problem) => wordProblemValidator(p as WordProblem)]
			: []),
		...(problem.kind === ProblemKind.N_DIGIT_OPERATION
			? [(p: Problem) => nDigitValidator(p as NDigitOperation)]
			: []),
		...(problem.kind === ProblemKind.DIGIT_TILE_PROBLEM
			? [(p: Problem) => digitTileValidator(p as DigitTileProblem)]
			: [])
	];

	return validators.flatMap((v) => v(problem));
}

import {
	Operator,
	ProblemKind,
	type MultipleChoiceProblem,
	type MultipleChoiceProblemAttempt,
	type NDigitOperation,
	type NDigitOperationAttempt,
	type Problem,
	type ProblemAttempt,
	type WordProblem,
	type WordProblemAttempt
} from '$lib/services/models';

export const graderFn = (problem: Problem, attempt: ProblemAttempt) => {
	let response = {
		correct: false,
		payload: attempt
	};
	switch (problem.kind) {
		case ProblemKind.MULTIPLE_CHOICE:
			response.correct = graderMultipleChoice(problem, attempt as MultipleChoiceProblemAttempt);
			break;
		case ProblemKind.WORD_PROBLEM:
			response.correct = graderWordProblem(problem, attempt as WordProblemAttempt);
			break;
		case ProblemKind.N_DIGIT_OPERATION:
			response.correct = graderNDigitOperation(problem, attempt as NDigitOperationAttempt);
			break;
		default:
			break;
	}

	return response;
};

const graderMultipleChoice = (
	problem: MultipleChoiceProblem,
	attempt: MultipleChoiceProblemAttempt
) => {
	const correctOption = problem.options.find((option) => option.isCorrect);
	if (!correctOption) {
		return false; // No correct option defined
	}
	if (attempt.selectedOptionId === correctOption.id) {
		return true;
	} else {
		return false;
	}
};

const graderWordProblem = (problem: WordProblem, attempt: WordProblemAttempt) => {
	const answerBlocks = problem.answerBlocks;

	return answerBlocks.every((block, index) => {
		if (index >= attempt.answerBlocks.length) {
			return false; // Not enough answers provided
		}
		const answer = attempt.answerBlocks[index];
		return block.value.toLowerCase() === answer.toLowerCase();
	});
};

const graderNDigitOperation = (problem: NDigitOperation, attempt: NDigitOperationAttempt) => {
	const correctAnswer = problem.operand1;
	const userAnswer = attempt.answer;
	// Assuming the operation is addition, subtraction, multiplication, or division
	let correct = false;
	switch (problem.operator) {
		case Operator.MINUS:
			correct = parseInt(correctAnswer) - parseInt(problem.operand2) === parseInt(userAnswer);
			break;
		case Operator.PLUS:
			correct = parseInt(correctAnswer) + parseInt(problem.operand2) === parseInt(userAnswer);
			break;
		case Operator.MULTIPLY:
			correct = parseInt(correctAnswer) * parseInt(problem.operand2) === parseInt(userAnswer);
			break;
		default:
			break;
	}
	return correct;
};

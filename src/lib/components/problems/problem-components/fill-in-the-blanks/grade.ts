import { ComputeEngine } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

export function isCorrect(value: string, correct: string) {
	const answer = ce.parse(value);
	const correctAnswer = ce.parse(correct);
	const isCorrect = answer.isSame(correctAnswer);
	return isCorrect;
}

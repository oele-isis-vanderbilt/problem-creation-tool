import { ComputeEngine } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

export function isCorrect(value: string, correct: string) {
	if (!ce) return false;
	const promptValue = value;
	const answer = ce.parse(promptValue);
	const correctAnswer = ce.parse(correct);
	const isCorrect = answer.isSame(correctAnswer);
	return isCorrect;
}

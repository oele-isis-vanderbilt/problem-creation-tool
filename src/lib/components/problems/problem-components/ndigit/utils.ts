import { Operator, type NDigitOperation } from '$lib/services/models';

export function getExpectedResult(problem: NDigitOperation): number {
	const operand1 = parseInt(problem.operand1, 10);
	const operand2 = parseInt(problem.operand2, 10);
	switch (problem.operator) {
		case Operator.PLUS:
			return operand1 + operand2;
		case Operator.MINUS:
			return operand1 - operand2;
		case Operator.MULTIPLY:
			return operand1 * operand2;
	}
}

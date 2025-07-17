import { Operator, type DigitTileProblem } from '$lib/services/models';

export default function validateProblem(problem: DigitTileProblem) {
	let errors: string[] = [];
	if (!problem.operator) {
		errors.push('Operator is required');
	}

	if (problem.operator === Operator.MINUS) {
		let minuendCount = problem.terms.filter((term) => term.role === 'minuend').length;
		let subtrahendCount = problem.terms.filter((term) => term.role === 'subtrahend').length;
		if (minuendCount !== 1) {
			errors.push('There must be exactly one minuend term for subtraction problems');
		}
		if (subtrahendCount < 1) {
			errors.push('There must be at least one subtrahend term for subtraction problems');
		}
	}

	if (problem.operator === Operator.PLUS) {
		let addendCount = problem.terms.filter((term) => term.role === 'addend').length;
		if (addendCount < 1) {
			errors.push('There must be at least one addend term for addition problems');
		}
	}

	if (problem.operator === Operator.MULTIPLY) {
		let multiplicandCount = problem.terms.filter((term) => term.role === 'multiplicand').length;
		let multiplierCount = problem.terms.filter((term) => term.role === 'multiplier').length;
		if (multiplicandCount !== 1) {
			errors.push('There must be exactly one multiplicand term for multiplication problems');
		}
		if (multiplierCount < 1) {
			errors.push('There must be at least one multiplier term for multiplication problems');
		}
	}

	if (problem.terms.some((term) => !term.role || !term.digits)) {
		errors.push('Each term must have a valid role and digit slots defined');
	}

	if (problem.solution === undefined || problem.solution === null) {
		errors.push('Solution is required');
	} else if (typeof problem.solution !== 'number') {
		errors.push('Solution must be a number');
	}

	return errors;
}

import type { ProblemAttempt, StateAssessment } from '$lib/services/models';
import type { Problem } from '$lib/services/models';
import { createQuizMachine } from 'xstate-quiz-machine';
import type { InitialContext } from 'xstate-quiz-machine';
import { graderFn } from './graders';

export const createAssessmentMachine = (
	assessment: StateAssessment,
	delayBetweenAttempts: number
) => {
	const initialContext: InitialContext<Problem, ProblemAttempt> = {
		attemptDuration: assessment.attemptTimeLimit,
		reviewDuration: assessment.reviewTimeLimit,
		questions: assessment.problems,
		graderFn: graderFn,
		maxAttemptPerQuestion: assessment.maxAttemptsPerQuestion,
		questionIdentifierFn: (problem) => problem.id,
		responseLoggerFn: (problem, answer) => {
			console.log(`Response for problem ${problem.id}:`, answer);
		}
	};
	const quizMachine = createQuizMachine(initialContext, delayBetweenAttempts);
	return quizMachine;
};

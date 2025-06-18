import type { ProblemRunState, StateAssessment } from '$lib/services/models';
import type { Problem } from '$lib/services/models';
import { createQuizMachine } from 'xstate-quiz-machine';
import type { InitialContext } from 'xstate-quiz-machine';

export const createAssessmentMachine = (
	assessment: StateAssessment,
	delayBetweenAttempts: number
) => {
	const initialContext: InitialContext<Problem, ProblemRunState> = {
		attemptDuration: assessment.attemptTimeLimit,
		reviewDuration: assessment.reviewTimeLimit,
		questions: assessment.problems,
		maxAttemptPerQuestion: assessment.maxAttemptsPerQuestion,
		questionIdentifierFn: (problem) => problem.id,
		responseLoggerFn: (problem, answer) => {
			console.log(`Response for problem ${problem.id}:`, answer);
		},
		graderFn: (problem, response) => {
			return {
				correct: response.isCorrect,
				payload: {
					...(JSON.parse(JSON.stringify(response)) as ProblemRunState)
				}
			};
		}
	};
	const quizMachine = createQuizMachine(initialContext, delayBetweenAttempts);
	return quizMachine;
};

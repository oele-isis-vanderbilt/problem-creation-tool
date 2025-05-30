import type { Problem, StateAssessment } from '$lib/services/models';
import { assign, createMachine, fromCallback, fromTransition, setup } from 'xstate';
import { fromPromise, createActor } from 'xstate';

export interface Context {
	currentProblem?: Problem;
	currrentQuestionIndex: number;
	currentAttemptCount: number;
	elapsedTimeSeconds?: number;
}

export enum AssessmentStages {
	STARTING = 'STARTING',
	IN_PROGRESS = 'ATTEMPTING',
	REVIEWING = 'REVIEWING',
	COMPLETED = 'COMPLETED'
}

export enum Commands {
	START_ASSESSMENT = 'START_ASSESSMENT',
	NEXT_QUESTION = 'NEXT_QUESTION',
	PREVIOUS_QUESTION = 'PREVIOUS_QUESTION',
	GOTO_REVIEW_STAGE = 'GOT_REVIEW_STAGE',
	GOTO_COMPLETION_STAGE = 'GOTO_COMPLETION_STAGE'
}

export const getTimerMachine = (limit: number) => {
	return setup({
		types: {
			context: {} as { duration: number; startedAt: number; remaining: number },
			events: {} as { type: 'TICK' | 'DONE' | 'START' | 'STOP' }
		},
		guards: {
			timeout: ({ context }) => {
				const elapsed = Math.floor((Date.now() - context.startedAt) / 1000);
				return elapsed > context.duration;
			}
		},
		actors: {
			tickCallback: fromCallback(({ sendBack, receive }) => {
				const interval = setInterval(() => {
					sendBack({ type: 'TICK' });
				}, 1000);

				return () => clearInterval(interval);
			})
		},
		actions: {
			resetTimer: ({ context }, _) => {
				context.startedAt = 0;
				context.remaining = context.duration;
			}
		}
	}).createMachine({
		id: 'timer',
		context: {
			duration: limit,
			startedAt: 0,
			remaining: limit
		},
		initial: 'STARTING',
		states: {
			STARTING: {
				on: {
					START: {
						target: 'IN_PROGRESS'
					}
				}
			},
			IN_PROGRESS: {
				entry: assign({
					startedAt: () => Date.now(),
					remaining: ({ context }) => context.duration
				}),
				exit: assign({
					startedAt: () => 0
				}),
				invoke: {
					id: 'tick',
					src: 'tickCallback'
				},
				on: {
					TICK: [
						{
							guard: 'timeout',
							target: 'DONE'
						},
						{
							actions: assign({
								remaining: ({ context }) => {
									const elapsed = Math.floor((Date.now() - context.startedAt) / 1000);
									return Math.max(0, context.duration - elapsed);
								}
							})
						}
					],
					STOP: {
						target: 'DONE'
					}
				}
			},
			DONE: {
				on: {
					START: {
						target: 'IN_PROGRESS'
					}
				}
			}
		}
	});
};

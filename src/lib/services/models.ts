export interface AppUser {
	id: string;
	name: string;
	picture?: string | null | undefined;
	provider: string;
}

export interface Concept {
	id: string;
	name: string;
	description: string;
	relatedConcepts?: string[];
	aiPrompt: string;
}

export interface Misconception {
	id: string;
	name: string;
	aiDefinition: string;
	aiFeedback: string;
}

export interface Module {
	id: string;
	name: string;
	description: string;
	coverImageUUID?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	problems: string[];
}

export interface ProblemMetadata {
	id: string;
	createdAt: string;
	updateAt: string;
	createdBy: string;
	moduleId: string;
}

export interface StateModule extends Omit<Module, 'problems'> {
	problems: Problem[];
}

export enum ProblemKind {
	MULTIPLE_CHOICE = 'multiple_choice',
	WORD_PROBLEM = 'word_problem',
	N_DIGIT_OPERATION = 'n_digit_operation'
}

export enum ProblemDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard'
}

interface BaseProblem {
	title: string;
	description: string;
	difficulty: ProblemDifficulty;
	concepts: string[];
	aiPrompt: string;
}

export enum MCQOptionKind {
	TEXT = 'text',
	FRACTION = 'fraction',
	IMAGE = 'image'
}

interface BaseMultipleChoiceOption {
	id: string;
	kind: MCQOptionKind;
	isCorrect: boolean;
	misconception: string;
}

export interface MultipleChoiceOptionText extends BaseMultipleChoiceOption {
	kind: MCQOptionKind.TEXT;
	displayName: string;
	value: string;
}

export interface MultipleChoiceOptionFraction extends BaseMultipleChoiceOption {
	kind: MCQOptionKind.FRACTION;
	numerator: string;
	denominator: string;
	wholeNumber?: string;
}

export interface MultipleChoiceOptionImage extends BaseMultipleChoiceOption {
	kind: MCQOptionKind.IMAGE;
	imageUUID: string;
	altText: string;
}

export type MultipleChoiceOption =
	| MultipleChoiceOptionText
	| MultipleChoiceOptionFraction
	| MultipleChoiceOptionImage;

export interface MultipleChoiceProblem extends BaseProblem {
	kind: ProblemKind.MULTIPLE_CHOICE;
	options: MultipleChoiceOption[];
}



export interface AnswerBlock {
	label?: string;
	value: string;
	placeholder: string;
}

export interface WordProblem extends BaseProblem {
	kind: ProblemKind.WORD_PROBLEM;
	answerBlocks: AnswerBlock[];
}

export enum Operator {
	PLUS = '+',
	MINUS = '-',
	MULTIPLY = '*'
}

export interface NDigitOperation extends BaseProblem {
	kind: ProblemKind.N_DIGIT_OPERATION;
	operand1: string;
	operand2: string;
	operator: Operator;
	includeCarryAndBorrow: boolean;
}

export type StateProblem = MultipleChoiceProblem & ProblemMetadata | WordProblem & ProblemMetadata | NDigitOperation & ProblemMetadata;

export type Problem = MultipleChoiceProblem | WordProblem | NDigitOperation;

export enum AssessmentGroup {
	CONTROL = 'control',
	TREATMENT = 'treatment'
}

export interface Assessment {
	id: string;
	title: string;
	problemIds: string[];
	moduleId: string;
	description: string;
	coverImageUUID?: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	attemptTimeLimit: number;
	reviewTimeLimit: number;
	maxAttemptsPerQuestion: number;
	group: AssessmentGroup;
}

export interface StateAssessment extends Omit<Assessment, 'problemIds'> {
	problems: Problem[];
}

export interface AssessmentAttempt {
	id: string;
	assessmentId: string;
	userId: string;
	startedAt: string;
	reviewStageEnteredAt?: string;
	completedAt?: string;
	problemAttempts: ProblemAttempt[];
}

export interface BaseProblemAttempt {
	problemId: string;
	assessmentAttemptId: string;
	attemptedAt: string;
	attemtptNumber: number;
}

// export

export interface MultipleChoiceProblemAttempt extends BaseProblemAttempt {
	kind: ProblemKind.MULTIPLE_CHOICE;
	selectedOptionId: string;
	isCorrect: boolean;
}

export interface WordProblemAttempt extends BaseProblemAttempt {
	kind: ProblemKind.WORD_PROBLEM;
	answerBlocks: string[];
}

export interface NDigitOperationAttempt extends BaseProblemAttempt {
	kind: ProblemKind.N_DIGIT_OPERATION;
	answer: string;
}

export type ProblemAttempt =
	| WordProblemAttempt
	| MultipleChoiceProblemAttempt
	| NDigitOperationAttempt;

export type ProblemRunState = any;
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

export interface StateModule extends Omit<Module, 'problems'> {
	problems: Problem[];
}

export enum ProblemKind {
	MULTIPLE_CHOICE = 'multiple_choice',
	WORD_PROBLEM = 'word_problem'
}

export enum ProblemDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard'
}

interface BaseProblem {
	id: string;
	title: string;
	description: string;
	difficulty: ProblemDifficulty;
	concepts: string[];
	aiPrompt: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
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

export type Problem = MultipleChoiceProblem | WordProblem;

export interface AppUser {
	id: string;
	name: string;
	picture?: string | null | undefined;
	provider: string;
}

export interface Tag {
	id: string;
	tagName: string;
	description?: string;
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
	WORD_PROBLEM = 'word_problem',
	N_DIGIT_OPERATION = 'n_digit_operation',
	DIGIT_TILE_PROBLEM = 'digit_tile_problem',
	FILL_IN_THE_BLANK = 'fill_in_the_blank'
}

export enum ProblemDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard'
}

export interface ProblemMetadata {
	id: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}

interface KLBaseProblem {
	title: string;
	description: string;
	difficulty: ProblemDifficulty;
	concepts: string[];
	aiPrompt: string;
	misconceptions: string[];
	tags: string[];
}

type BaseProblem = KLBaseProblem & ProblemMetadata;

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

export const TERM_ROLES = [
	'minuend',
	'subtrahend',
	'addend',
	'multiplicand',
	'multiplier'
] as const;

export interface TermConfig {
	role: (typeof TERM_ROLES)[number];
	digits: number;
}

export interface DigitTileProblem extends BaseProblem {
	kind: ProblemKind.DIGIT_TILE_PROBLEM;
	operator: Operator;
	terms: TermConfig[];
	solution: number;
}

export interface FillInTheBlankProblem extends BaseProblem {
	kind: ProblemKind.FILL_IN_THE_BLANK;
	latex: string;
	blanks: {
		[key: string]: number | string;
	};
}

export type Problem =
	| MultipleChoiceProblem
	| WordProblem
	| NDigitOperation
	| DigitTileProblem
	| FillInTheBlankProblem;

export type KLMultipleChoiceProblem = Omit<
	MultipleChoiceProblem,
	'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;
export type KLWordProblem = Omit<WordProblem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type KLNDigitOperation = Omit<
	NDigitOperation,
	'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;
export type KLDigitTileProblem = Omit<
	DigitTileProblem,
	'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;

export type KLFillInTheBlankProblem = Omit<
	FillInTheBlankProblem,
	'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;

export type KLProblem =
	| KLMultipleChoiceProblem
	| KLWordProblem
	| KLNDigitOperation
	| KLDigitTileProblem
	| KLFillInTheBlankProblem;

export interface XAPIStatement {
	verb: string;
	object: string;
	actor?: string;
	result?: any;
	extensions?: any;
}

export interface BaseProblemRunState {
	problem: Problem;
	isCorrect: boolean;
	canGrade: boolean;
	canGradeFeedback: string[];
}

export interface MCQProblemRunState extends BaseProblemRunState {
	kind: ProblemKind.MULTIPLE_CHOICE;
	selectedOptionId: string | null;
}

export interface WordProblemRunState extends BaseProblemRunState {
	kind: ProblemKind.WORD_PROBLEM;
	answerBlockValues: String[];
}

export interface NDigitOperationRunState extends BaseProblemRunState {
	kind: ProblemKind.N_DIGIT_OPERATION;
	carryAndBurrowBlocks: string[];
	finalResult: string;
}
export interface DigitTileProblemRunState extends BaseProblemRunState {
	kind: ProblemKind.DIGIT_TILE_PROBLEM;
	terms: {
		slotIndex: number;
		termIndex: number;
		value: number | null;
	}[];
}

export interface FillInTheBlankProblemRunState extends BaseProblemRunState {
	kind: ProblemKind.FILL_IN_THE_BLANK;
	blankValues: Record<string, string>;
}

export type ProblemRunState =
	| MCQProblemRunState
	| WordProblemRunState
	| NDigitOperationRunState
	| DigitTileProblemRunState
	| FillInTheBlankProblemRunState;

export type KLMCQProblemRunState = Omit<MCQProblemRunState, 'problem'> & {
	initialized: boolean;
	xapi?: XAPIStatement;
};
export type KLWordProblemRunState = Omit<WordProblemRunState, 'problem'> & {
	initialized: boolean;
	xapi?: XAPIStatement;
};
export type KLNDigitOperationRunState = Omit<NDigitOperationRunState, 'problem'> & {
	initialized: boolean;
	xapi?: XAPIStatement;
};
export type KLDigitTileProblemRunState = Omit<DigitTileProblemRunState, 'problem'> & {
	initialized: boolean;
	xapi?: XAPIStatement;
};

export type KLFillInTheBlankProblemRunState = Omit<FillInTheBlankProblemRunState, 'problem'> & {
	initialized: boolean;
	xapi?: XAPIStatement;
};

export type KLProblemRunState =
	| KLMCQProblemRunState
	| KLWordProblemRunState
	| KLNDigitOperationRunState
	| KLDigitTileProblemRunState
	| KLFillInTheBlankProblemRunState;

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

export interface ExportedModule
	extends Omit<Module, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {
	tags: Tag[];
	concepts: Concept[];
	misconceptions: Misconception[];
}

export interface ExportedAssessment
	extends Omit<Assessment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'moduleId'> {
	kind: 'Assessment';
}

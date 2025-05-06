import type { JSONContent } from '@tiptap/core';
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

export interface Module {
	id: string;
	name: string;
	description: string;
	coverImageUUID?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	problems: Record<string, Problem>;
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
	description: JSONContent;
	difficulty: ProblemDifficulty;
	concepts: string[];
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
}

export interface MultipleChoiceOption {
	displayName: string;
	value: string;
	isCorrect: boolean;
	misconceptions?: string[];
}

export interface MultipleChoiceProblem extends BaseProblem {
	kind: ProblemKind.MULTIPLE_CHOICE;
	conceptIds?: string[];
	options: MultipleChoiceOption[];
}

export interface WordProblem extends BaseProblem {
	kind: ProblemKind.WORD_PROBLEM;
	answer: string;
}

export type Problem = MultipleChoiceProblem | WordProblem;

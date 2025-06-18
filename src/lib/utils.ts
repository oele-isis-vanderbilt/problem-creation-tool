import type { AgentAuth } from '@knowlearning/agents/browser';
import { debounce as df, chunk } from 'underscore';
import { base } from '$app/paths';
import type { Concept, Misconception } from './services/models';

export const isAnonUser = (auth: AgentAuth) => {
	return auth.info?.name === 'anonymous';
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	waitFor: number
) => {
	const debounced = df(func, waitFor);
	return debounced;
};

export const friendlyDateTime = (isoString: string) => {
	const date = new Date(isoString);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	return date.toLocaleDateString('en-US', options);
};

export const timestampToDate = (timestamp: number) => {
	const date = new Date(timestamp);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	return date.toLocaleDateString('en-US', options);
};

export function prependBaseUrl(url: string) {
	const urlWithoutLeadingSlash = url.replace(/^\//, '');
	if (base) {
		return `${base}/${urlWithoutLeadingSlash}`;
	} else {
		return `/${urlWithoutLeadingSlash}`;
	}
}

export function paginate<T>(array: T[], pageSize: number = 10) {
	return chunk(array, pageSize);
}

export function emptyConcept(): Concept {
	return {
		id: '',
		name: '',
		description: '',
		aiPrompt: '',
		relatedConcepts: []
	} as Concept;
}

export function emptyMisconception(): Misconception {
	return {
		id: '',
		name: '',
		aiDefinition: '',
		aiFeedback: ''
	} as Misconception;
}

export function getMathJAXFraction(
	numerator: string,
	denominator: string,
	wholeNumber: string | null = null
): string {
	const wholeNumberPart = wholeNumber
		? `\$\$${wholeNumber} \\frac{${numerator}}{${denominator}}\$\$`
		: `\$\$\\frac{${numerator}}{${denominator}}\$\$`;
	return wholeNumberPart;
}

export function emptyTag() {
	return {
		id: '',
		tagName: '',
		description: ''
	};
}

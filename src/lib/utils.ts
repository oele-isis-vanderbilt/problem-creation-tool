import type { AgentAuth } from '@knowlearning/agents/browser';
import { debounce as df } from 'underscore';
import { base } from '$app/paths'


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



export function prependBaseUrl(url: string) {
	const urlWithoutLeadingSlash = url.replace(/^\//, '');
    if (base) {
		return `${base}/${urlWithoutLeadingSlash}`;
	}
	else {
		return `/${urlWithoutLeadingSlash}`;
	}
}
import type { AgentAuth } from '@knowlearning/agents/browser';

export const isAnonUser = (auth: AgentAuth) => {
	return auth.info?.name === 'anonymous';
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	waitFor: number
) => {
	let timeout: NodeJS.Timeout;

	const debounced = (...args: Parameters<F>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), waitFor);
	};

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

import { guess } from '$lib/utils/word';

export async function get() {
	const word = 'granuliferous';
	const attempt = 'granluuuuuuuu'.split('');

	const { result, won } = guess(word, attempt);

	return {
		status: 200,
		body: {
			word: word.split(''),
			attempt,
			result,
			won
		}
	};
}

import cheerio from 'cheerio';
import UserAgent from 'user-agents';

export async function get() {
	const agent = new UserAgent();

	const res = await fetch('https://randomword.com/', {
		method: 'GET',
		headers: {
			'User-Agent': agent.toString()
		}
	});

	const data = await res.text();

	const $ = cheerio.load(data);
	const word = $('#random_word').text();

	return {
		body: {
			word
		}
	};
}

export const ssr = false;

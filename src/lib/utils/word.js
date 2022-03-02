import path from 'path';
import fs from 'fs';
import readline from 'readline';

import cheerio from 'cheerio';
import UserAgent from 'user-agents';
import { packageDirectory } from 'pkg-dir';

export async function dynamicRandom() {
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

	return word;
}

export async function staticRandom() {
	const root = await packageDirectory();
	const file = path.join(root, 'static', 'words.txt');

	const word = await new Promise((resolve) => {
		const rl = readline.createInterface({
			input: fs.createReadStream(file),
			// @ts-ignore
			output: process.stdout,
			terminal: false
		});

		rl.on('line', (line) => {
			const rand = Math.random() < 0.001;
			const filter = line.match(/[\d\W]/);

			if (rand === true && !filter && line.length > 4) {
				rl.close();
				resolve(line);
			}
		});
	});

	return word;
}

export async function random(source = 'dynamic') {
	let word = null;

	switch (source) {
		case 'static':
			word = await staticRandom();
		case 'dynamic':
		default:
			word = await dynamicRandom();
	}

	return word;
}

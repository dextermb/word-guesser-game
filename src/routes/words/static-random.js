import path from 'path';
import fs from 'fs';
import readline from 'readline';

import { packageDirectory } from 'pkg-dir';

export async function get() {
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

	return {
		body: {
			word
		}
	};
}

export const ssr = false;

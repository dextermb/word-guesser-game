import { Server } from 'socket.io';

import { random } from '../lib/utils/word.js';

const config = {
	name: 'sveltekit-socket-io',
	configureServer(server) {
		const io = new Server(server.httpServer, {
			cors: {
				origin: 'http://localhost:3000'
			}
		});

		io.on('connection', async (socket) => {
			let word = null;
			let bits = null;

			async function setup() {
				word = await random();
				word = word.toLowerCase();
				bits = word.split('');

				console.log(word);

				socket.emit('word:length', word.length);
			}

			setup();

			socket.on('word:new', setup);

			socket.on('word:reveal', () => {
				socket.emit('word:reveal', word);
			});

			socket.on('word:guess', ({ row, guess }) => {
				const filtered = [...bits];

				const result = guess.map((g, i) => {
					if (g === bits[i]) {
						filtered[i] = null;

						return 2;
					}

					if (filtered.includes(g)) {
						const bi = filtered.findIndex((b) => b === g);

						filtered[bi] = null;

						return 1;
					}

					return 0;
				});

				socket.emit('word:guess', {
					row,
					result,
					won: result.filter((r) => r === 2).length === bits.length
				});
			});

			socket.on('disconnect', () => {
				console.log('A user has disconnected');
			});
		});
	}
};

export default () => config;

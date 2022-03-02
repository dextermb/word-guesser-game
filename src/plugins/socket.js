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
				word = await random('static');
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
				const result = guess.map((g, i) => g === bits[i]);

				socket.emit('word:guess', {
					row,
					result,
					won: result.filter((r) => r).length === bits.length
				});
			});

			socket.on('disconnect', () => {
				console.log('A user has disconnected');
			});
		});
	}
};

export default () => config;

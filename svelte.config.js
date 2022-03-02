import adapter from '@sveltejs/adapter-auto';
import socket from './src/plugins/socket.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [socket()]
		}
	}
};

export default config;

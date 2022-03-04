import pusher from '$lib/services/pusher';
import { random } from '$lib/utils/word';

export async function post({ request }) {
	const word = await random();
	const { events } = await request.json();

	for (let i = 0; i < events.length; i++) {
		const { channel, data, event, socket_id: socketId } = events[i];

		let output = {};

		switch (event) {
			case 'client-new-word':
				output.event = 'server-word-length';
				output.body = word.length;

				break;
		}

		console.log(output);

		await pusher.trigger(channel, output.event, output.body, { socket_id: socketId });
	}

	return {
		status: 204
	};
}

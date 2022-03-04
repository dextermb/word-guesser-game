import pusher from '$lib/services/pusher';
import { random } from '$lib/utils/word';

export async function post({ request }) {
	const word = await random();
	const { events } = await request.json();

	for (let i = 0; i < events.length; i++) {
		const { channel, data, event } = events[i];

		let output = { channel };

		switch (event) {
			case 'client-new-word':
				output.event = 'server-word-length';
				output.body = word.length;

				break;
		}

		console.log(output);

		console.log(await pusher.trigger(output.channel, output.event, output.body));
	}

	return {
		status: 204
	};
}

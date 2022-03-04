import pusher from '$lib/services/pusher';
import { random, guess } from '$lib/utils/word';

export async function post({ request }) {
	const word = await random();
	const { events } = await request.json();

	for (let i = 0; i < events.length; i++) {
		const { channel, data, event } = events[i];
		const output = { channel };

		switch (event) {
			case 'client-new-word':
				output.event = 'server-word-length';
				output.body = word.length;

				break;
			case 'client-reveal-word':
				output.event = 'server-reveal-word';
				output.body = word;

				break;
			case 'client-word-guess':
				const { result, won } = guess(word, data);

				output.event = 'server-word-guess';
				output.body = {
					row: data.row,
					result,
					won
				};
		}

		await pusher.trigger(output.channel, output.event, output.body);
	}

	return {
		status: 204
	};
}

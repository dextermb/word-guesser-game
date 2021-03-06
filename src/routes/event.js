import pusher from '$lib/services/pusher';
import { Session } from '$lib/services/mongo';

import { random, guess } from '$lib/utils/word';

export async function post({ request }) {
	const { events } = await request.json();

	for (let i = 0; i < events.length; i++) {
		const { channel, data: raw, event, socket_id: socketId } = events[i];
		const data = JSON.parse(raw);
		const output = { channel };

		const session = await Session.findOneAndUpdate(
			{ socketId },
			{ socketId },
			{ upsert: true }
		).exec();

		console.log('session %O', session);

		let word = null;
		let newWord = false;

		if (!session.word) {
			newWord = true;

			await session.update({
				word: (word = await random())
			});
		} else {
			word = session.word;
		}

		switch (event) {
			case 'client-new-word':
				if (newWord === false) {
					await session.update({
						word: (word = await random())
					});
				}

				output.event = 'server-word-length';
				output.body = word.length;

				break;
			case 'client-reveal-word':
				output.event = 'server-reveal-word';
				output.body = word;

				break;
			case 'client-guess-word':
				const { result, won } = guess(word, data.guess);

				output.event = 'server-guess-word';
				output.body = {
					row: data.row,
					result,
					won
				};

				break;
			default:
				output.event = 'server-unknown-event';
				output.body = 'This event is not supported';
		}

		await pusher.trigger(output.channel, output.event, output.body);
	}

	return {
		status: 204
	};
}

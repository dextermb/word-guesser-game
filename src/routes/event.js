export async function post({ request }) {
	const data = await new Promise((resolve) => {
		let data = '';

		request.on('data', (chunk) => (data += chunk));
		request.on('end', () => resolve(JSON.parse(data)));
	});

	const { events } = data;

	console.log(events);

	return {
		status: 204
	};
}

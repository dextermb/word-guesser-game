export async function post({ request }) {
	const { events } = await request.json();

	console.log(events);

	return {
		status: 204
	};
}

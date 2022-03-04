import pusher from '$lib/services/pusher';

export async function post({ request }) {
	const body = await request.formData();

	return {
		status: 200,
		body: pusher.authenticate(body.get('socket_id'), body.get('channel_name'))
	};
}

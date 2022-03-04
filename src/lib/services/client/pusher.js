// @ts-nocheck
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER
});

export default pusher;

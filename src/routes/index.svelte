<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Icon, Eye, Refresh } from 'svelte-heroicons';

	import pusher from '$lib/services/client/pusher.js';

	import Button from '$lib/components/Button.svelte';
	import Board from '$lib/components/Board.svelte';

	const totalRows = 10;
	let totalCols = 1;
	let currentRow = 0;
	let currentCol = 0;

	let channel = null;
	let rows = [[['', null]]];

	function guess(row) {
		const guess = rows[row].map((col) => col[0]);

		channel.trigger('client-word-guess', { row, guess });
	}

	function restart() {
		channel.trigger('client-new-word', {});
	}

	function reveal() {
		channel.trigger('client-reveal-word', {});
	}

	onMount(() => {
		channel = pusher.subscribe('private-game');

		channel.bind('pusher:subscription_succeeded', () => {
			channel.trigger('client-new-word', {});
		});

		channel.bind('pusher:connection_failed', (data) => {
			alert(`Unable to connect to server: ${JSON.stringify(data)}`);
		});

		channel.bind('server-word-length', (data) => {
			totalCols = data;
			currentRow = 0;
			currentCol = 0;

			rows = Array(totalRows)
				.fill(null)
				.map((_) =>
					Array(totalCols)
						.fill(null)
						.map((_) => ['', null])
				);
		});

		channel.bind('server-guess-word', (data) => {
			data.result.forEach((result, i) => {
				rows[data.row][i] = [rows[data.row][i][0], result];
			});

			if (data.won) {
				rows = [rows[data.row]];
			}
		});

		channel.bind('server-reveal-word', (data) => {
			alert(data);
		});
	});
</script>

<Board {totalRows} {totalCols} {currentRow} {currentCol} {rows} {guess} />
<div class="absolute flex w-full bottom-4 justify-center items-center space-x-4">
	<input
		class="appearance-none px-4 py-2 text-sm bg-gray-100 rounded-md shadow-sm border-b-2 border-b-gray-300 placeholder-gray-400"
		placeholder="Try typing..."
	/>
	<Button on:click={restart}>
		<Icon src={Refresh} class="h-5 w-5 group-hover:animate-spin-slow" />
	</Button>
	<Button on:click={reveal}>
		<Icon src={Eye} class="w-5 h-5" />
	</Button>
</div>

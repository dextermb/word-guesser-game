<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import c from 'clsx';

	import Button from '$lib/components/Button.svelte';

	const TOTAL_ROWS = 5;
	let TOTAL_COLS = 1;

	const ARR_TOTAL_ROWS = TOTAL_ROWS - 1;
	let ARR_TOTAL_COLS = 0;
	let ARR_CURRENT_ROW = 0;
	let ARR_CURRENT_COL = 0;

	let socket;
	let rows = [[['', null]]];

	// Normalized limits
	$: ARR_TOTAL_COLS = TOTAL_COLS - 1;
	$: LAST_ROW = ARR_CURRENT_ROW === ARR_TOTAL_ROWS;
	$: LAST_COL = ARR_CURRENT_COL === ARR_TOTAL_COLS;

	function guess(row) {
		const guess = rows[row].map((col) => col[0]);

		socket.emit('word:guess', { row, guess });
	}

	function restart() {
		socket.emit('word:new');
	}

	function reveal() {
		socket.emit('word:reveal');
	}

	onMount(() => {
		socket = io();

		socket.on('word:length', (data) => {
			TOTAL_COLS = data;
			ARR_CURRENT_ROW = 0;
			ARR_CURRENT_COL = 0;

			rows = Array(TOTAL_ROWS)
				.fill(null)
				.map((_) =>
					Array(TOTAL_COLS)
						.fill(null)
						.map((_) => ['', null])
				);
		});

		socket.on('word:guess', (data) => {
			data.result.forEach((result, i) => {
				rows[data.row][i] = [rows[data.row][i][0], result];
			});

			if (data.won) {
				rows = [rows[data.row]];
			}
		});

		socket.on('word:reveal', (data) => {
			alert(data);
		});

		return () => socket.close();
	});

	onMount(() => {
		const fn = (event) => {
			const [, guessed] = rows[ARR_CURRENT_ROW][ARR_CURRENT_COL];

			// If already guessed than stop
			if (typeof guessed === 'boolean') {
				return;
			}

			// Typing
			if (event.key.match(/^[a-z]$/)) {
				rows[ARR_CURRENT_ROW][ARR_CURRENT_COL] = [event.key.toLowerCase(), null];

				if (LAST_ROW && LAST_COL) {
					guess(ARR_CURRENT_ROW);

					return;
				}

				if (!LAST_COL) {
					ARR_CURRENT_COL += 1;
				} else if (!LAST_ROW) {
					guess(ARR_CURRENT_ROW);

					ARR_CURRENT_ROW += 1;
					ARR_CURRENT_COL = 0;
				}

				return;
			}

			// Undo
			if (event.keyCode === 8) {
				if (!rows[ARR_CURRENT_ROW][ARR_CURRENT_COL][0] && ARR_CURRENT_COL > 0) {
					ARR_CURRENT_COL -= 1;
				}

				rows[ARR_CURRENT_ROW][ARR_CURRENT_COL] = ['', null];

				if (ARR_CURRENT_COL > 0) {
					ARR_CURRENT_COL -= 1;
				}

				return;
			}

			// Force-guess
			if (event.keyCode === 13) {
				guess(ARR_CURRENT_ROW);

				if (ARR_CURRENT_ROW < ARR_TOTAL_ROWS) {
					ARR_CURRENT_ROW += 1;
					ARR_CURRENT_COL = 0;
				}
			}
		};

		document.body.addEventListener('keydown', fn);

		return () => document.body.removeEventListener('keydown', fn);
	});
</script>

<div class="h-screen flex justify-center items-center p-4">
	<div
		class="grid gap-2 grid-cols-3"
		style={`grid-template-columns: repeat(${TOTAL_COLS}, minmax(0, 1fr))`}
	>
		{#each rows as columns, ri}
			{#each columns as column, ci}
				<div
					class={c(
						'w-10 h-10 rounded-md shadow-sm border-b-2 flex justify-center items-center flex-col',
						column[1] === null && 'bg-gray-100 border-b-gray-300',
						column[1] === false && 'bg-orange-100 border-b-orange-300 text-orange-700',
						column[1] === true && 'bg-green-100 border-b-green-300 text-green-700'
					)}
				>
					<p class="text-sm">{column[0]}</p>
					<p
						class={c(
							'text-xs',
							column[1] === null && 'text-gray-400',
							column[1] === false && 'text-orange-400',
							column[1] === true && 'text-green-400'
						)}
					>
						{ri},{ci}
					</p>
				</div>
			{/each}
		{/each}
	</div>
</div>
<div class="absolute flex w-full bottom-4 justify-center items-center space-x-4">
	<input
		class="appearance-none px-4 py-2 text-sm bg-gray-100 rounded-md shadow-sm border-b-2 border-b-gray-300 placeholder-gray-400"
		placeholder="Try typing..."
	/>
	<Button on:click={restart}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 group-hover:animate-spin-slow"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
				clip-rule="evenodd"
			/>
		</svg>
	</Button>
	<Button on:click={reveal}>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
			<path
				fill-rule="evenodd"
				d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
				clip-rule="evenodd"
			/>
		</svg>
	</Button>
</div>

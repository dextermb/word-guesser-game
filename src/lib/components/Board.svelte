<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import c from 'clsx';

	let TOTAL_ROWS = 10;
	let TOTAL_COLS = 1;

	let guess;
	let rows = [[['', null]]];

	let ARR_TOTAL_ROWS = 0;
	let ARR_TOTAL_COLS = 0;
	let ARR_CURRENT_ROW = 0;
	let ARR_CURRENT_COL = 0;

	$: ARR_TOTAL_ROWS = TOTAL_ROWS - 1;
	$: ARR_TOTAL_COLS = TOTAL_COLS - 1;
	$: LAST_ROW = ARR_CURRENT_ROW === ARR_TOTAL_ROWS;
	$: LAST_COL = ARR_CURRENT_COL === ARR_TOTAL_COLS;

	onMount(() => {
		const fn = (event) => {
			const [, guessed] = rows[ARR_CURRENT_ROW][ARR_CURRENT_COL];

			// If already guessed than stop
			if (typeof guessed === 'number') {
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

	export {
		TOTAL_ROWS as totalRows,
		TOTAL_COLS as totalCols,
		ARR_CURRENT_ROW as currentRow,
		ARR_CURRENT_COL as currentCol,
		guess,
		rows
	};
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
						column[1] === 0 && 'bg-red-100 border-b-red-300 text-red-700',
						column[1] === 1 && 'bg-orange-100 border-b-orange-300 text-orange-700',
						column[1] === 2 && 'bg-green-100 border-b-green-300 text-green-700'
					)}
				>
					<p class="text-sm">{column[0]}</p>
					<p
						class={c(
							'text-xs',
							column[1] === null && 'text-gray-400',
							column[1] === 0 && 'text-red-400',
							column[1] === 1 && 'text-orange-400',
							column[1] === 2 && 'text-green-400'
						)}
					>
						{ri + 1},{ci + 1}
					</p>
				</div>
			{/each}
		{/each}
	</div>
</div>

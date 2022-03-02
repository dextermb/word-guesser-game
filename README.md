# Word Guesser Game

A simple example of using [Svelte Kit](https://kit.svelte.dev) with [sockets](https://socket.io) to create a real-time game, in this case guessing words.

As part of running the game locally you must get a source for `words.txt` within `./static` or change `./src/plugins/socket.js#19` to be "dynamic" rather than "static". When dynamic random-words are enabled it will use [randomword.com](https://randomword.com/) as a source instead.

You must also copy the `socket.io.min.js` and `socket.io.min.js.map` files from `node_modules` into `./static` to inject the client-side socket library.

_This is game is not supposed to be production-ready._

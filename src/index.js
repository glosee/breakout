import './styles/main.css';

import startGame from './modules/game.js';

if (ENV !== 'production') {
	// Enable livereload
	const lrScript = document.createElement('script');
	lrScript.src = `http://${(location.host || 'localhost').split(':')[0]}:35729/livereload.js?snipver=1`;
	document.body.appendChild(lrScript);
}

// Get the canvas element to draw the game into
const canvas = document.getElementById('main');
const end = startGame(canvas, 15);
console.log(end);

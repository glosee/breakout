import config from '../config.js';

/**
 * Draws a circle into the context passed in.
 *
 * @param {canvasContext} ctx - The context from a canvas DOM element
 * @param {object} options - The x, y, width, and height values for the circle
 */
const drawCircle = (ctx, { x, y } = { x: 50, y: 50 }) => {
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.fillStyle = config.colors.ball.base;
	ctx.fill();
	ctx.closePath();
};

const clear = (ctx, state) => {
	ctx.clearRect(0, 0, state.canvas.w, state.canvas.h);
};

const draw = (ctx, state) => {
	let dx = 2;
	let dy = -2;
	return () => {
		clear(ctx, state);
		const ballPosition = { x: state.ball.x + dx, y: state.ball.y + dy };
		drawCircle(ctx, ballPosition);
		dx += 1;
		dy -= 1;
	};
};

/**
 * Accepts a canvas element and draws the game using its context.
 * Returns a function that you can use to end the game.
 *
 * @param {canvas} canvas - A canvas DOM element
 * @returns {function} - A function that will end the game
 */
const startGame = (canvas, frameRate = 10) => {
	if (!canvas) {
		throw new TypeError('Cannot render without a valid canvas element');
	}
	const context = canvas.getContext('2d');
	const state = {
		ball: {
			x: canvas.width / 2,
			y: canvas.height - 30,
		},
		canvas: {
			w: canvas.width,
			h: canvas.height,
		},
	};
	const interval = setInterval(draw(context, state), frameRate);
	return () => {
		alert('game over');
		clearInterval(interval);
	};
};

export default startGame;

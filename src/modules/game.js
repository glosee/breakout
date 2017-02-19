import config from '../config.js';

/**
 * Takes a canvas context and returns a function that takes an object of params to use
 * to draw a circle into the originally passed in context.
 *
 * @param {canvasContext} ctx - The context from a canvas DOM element
 * @returns {function} - A function that accepts an object with x, y, and radius values
 * with which to draw circle into the originally passed in context.
 */
const drawCircle = (ctx) => ({ x, y, r }) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = config.colors.ball.base;
	ctx.fill();
	ctx.closePath();
};

/**
 * Takes a context and an object with w and h values for the canvas that you want to clear,
 * and returns a curried function that will clear the canvas context so you can draw the next frame.
 *
 * @param {canvasContext} ctx - The context for which you want to clear
 * @param {object} {w, h} - An object with the width and height of the canvas that holds the context
 * you want to clear.
 * @returns {function} - A curried function that you can call anywhere to clear the context without
 * having to retain a reference to it.
 */
const clearFrame = (ctx, { w, h }) => () => {
	ctx.clearRect(0, 0, w, h);
};

/**
 * Takes a context and an initial state to curry into another function that works as the game loop.
 * Curries other `clearFrame` and `drawCircle` functions to be able to run them cleanly each tick.
 * Every tick calculates the next state by increasing values in the initial state by the frameRate
 * (amongst other calculations and values). The function this returns is meant to be passed into
 * `setInterval` or `requestAnimationFrame`.
 *
 * @param {canvasContext} ctx - The context of the canvas that you want to draw the game into.
 * @param {object} state - The initial state of the game.
 */
const draw = (ctx, state) => {
	const frameRate = 2;

	let dx = frameRate;
	let dy = -frameRate;

	const clear = clearFrame(ctx, state.canvasSize);
	const drawBall = drawCircle(ctx);

	const nextState = () => {
		const { ball, canvasSize } = state;
		// If the ball hits the wall on any side of the canvas then reverse direction on that axis
		if (ball.x + dx > canvasSize.w - ball.r || ball.x + dx < ball.r) {
			dx = -dx;
		}
		if (ball.y + dy > canvasSize.h - ball.r || ball.y + dy < ball.r) {
			dy = -dy;
		}
		state.ball.x += dx;
		state.ball.y += dy;
		return state;
	};

	return () => {
		clear();
		const next = nextState();
		drawBall(next.ball);
	};
};

/**
 * Creates the initial state for the game based on the size of the canvas element passed in.
 *
 * @param {canvas} canvas - A canvas DOM element that denotes the boundaries of the game
 * @returns {object} - The intended initial state of the game.
 */
const initialState = canvas => ({
	ball: {
		x: canvas.width / 2,
		y: canvas.height - 30,
		r: config.ball.radius,
	},
	canvasSize: {
		w: canvas.width,
		h: canvas.height,
	},
});

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
	const interval = setInterval(draw(context, initialState(canvas)), frameRate);
	return () => {
		alert('game over');
		clearInterval(interval);
	};
};

export default startGame;

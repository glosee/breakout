import config from '../config.js';

/**
 * Takes a canvas context and returns a function that takes an object of params to use
 * to draw a circle into the originally passed in context.
 *
 * @param {canvasContext} ctx - The context from a canvas DOM element
 * @returns {function} - A function that accepts an object with x, y, and radius values
 * with which to draw circle into the originally passed in context.
 */
const drawCircle = ctx => ({ x, y, r }) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = config.colors.ball.base;
	ctx.fill();
	ctx.closePath();
};

const drawRect = ctx => ({ x, y, w, h }) => {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = config.colors.paddle.base;
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

	let bx = frameRate;
	let by = -frameRate;
	let px = 7;

	const clear = clearFrame(ctx, state.canvasSize);
	const drawBall = drawCircle(ctx);
	const drawPaddle = drawRect(ctx);

	document.addEventListener('keydown', e => {
		if (e.keyCode === 39) {
			state.user.keys.right = true;
		} else if (e.keyCode === 37) {
			state.user.keys.left = true;
		}
	});

	document.addEventListener('keyup', e => {
		if (e.keyCode === 39) {
			state.user.keys.right = false;
		} else if (e.keyCode === 37) {
			state.user.keys.left = false;
		}
	});

	const nextFrame = () => {
		const { ball, canvasSize, user, paddle } = state;
		// If the ball hits the wall on any side of the canvas then reverse direction on that axis
		if (ball.x + bx > canvasSize.w - ball.r || ball.x + bx < ball.r) {
			bx = -bx;
		}
		if (ball.y + by < ball.r) {
			by = -by;
		} else if (ball.y + by > canvasSize.h - ball.r) {
			if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
				by = -by;
			} else {
				window.location.reload();
			}
		}
		state.ball.x += bx;
		state.ball.y += by;
		// If the user is pressing a key then move the paddle
		if (user.keys.right && paddle.x < canvasSize.w - paddle.w) {
			state.paddle.x += px;
		} else if (user.keys.left && paddle.x > 0) {
			state.paddle.x -= px;
		}
		return state;
	};

	// This method is designed to run inside `setInterval` to draw the game at its current state on every frame.
	return () => {
		clear();
		const next = nextFrame();
		drawBall(next.ball);
		drawPaddle(next.paddle);
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
	paddle: {
		w: 75,
		h: 10,
		x: ((canvas.width - 75) / 2),
		y: (canvas.height - 20),
	},
	canvasSize: {
		w: canvas.width,
		h: canvas.height,
	},
	user: {
		keys: {
			right: false,
			left: false,
		},
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

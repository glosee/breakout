import config from '../config.js';
import { clearFrame, drawCircle, drawRect, getBrickPos } from '../utils/drawing-utils.js';

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

	// movement rates for game elements
	let bx = frameRate;
	let by = -frameRate;
	let px = 7;

	const clear = clearFrame(ctx, state.canvasSize);
	const drawBall = drawCircle(ctx);
	const drawPaddle = drawRect(ctx);
	const drawBrick = drawRect(ctx);

	const drawBricks = () => {
		for (let c = 0; c < config.brick.colCount; c++) {
			state.bricks[c] = [];
			for (let r = 0; r < config.brick.rowCount; r++) {
				const brick = Object.assign({}, getBrickPos(c, r), { w: config.brick.w, h: config.brick.h });
				drawBrick(brick);
				state.bricks[c][r] = brick;
			}
		}
	};

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
		drawBricks();
	};
};

/**
 * Creates the initial state for the game based on the size of the canvas element passed in.
 *
 * @param {canvas} canvas - A canvas DOM element that denotes the boundaries of the game
 * @returns {object} - The intended initial state of the game.
 */
const initialState = canvas => ({
	bricks: [],
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

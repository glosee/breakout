import config from '../config.js';
import { clearFrame, drawCircle, drawRect, getBrickPos } from '../utils/drawing-utils.js';

/**
 * Takes a context and an initial state to curry into another function tha
 * works as the game loop. Curries other `clearFrame` and `drawCircle`
 * functions to be able to run them cleanly each tick. Every tick calculates
 * the next state by increasing values in the initial state by the frameRate
 * (amongst other calculations and values). The function this returns is meant
 * to be passed into `setInterval` or `requestAnimationFrame`.
 *
 * @param {canvasContext} ctx - The context of the canvas that you want to draw
 * the game into.
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

	const drawBricks = (bricks) => {
		bricks.forEach(column => {
			return column.forEach(brick => {
				if (brick.status > 0) {
					drawBrick(brick);
				}
			});
		});
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

	const moveBall = ({ ball }) => {
		return {
			x: ball.x + bx,
			y: ball.y + by,
		};
	};

	const brickCollision = ({ball, bricks}) => {
		if (!bricks) {
			return;
		}
		return bricks.map(column => {
			return column.map(brick => {
				if (
						brick.status > 0 &&
						ball.x > brick.x &&
						ball.x < brick.x + brick.w &&
						ball.y > brick.y &&
						ball.y < brick.y + brick.h
				) {
					// TODO: This is impure. You can't adjust the ball direction inside
					// this function
					by = -by;
					return Object.assign(brick, { status: 0 });
				}
				return brick;
			});
		});
	};

	const nextFrame = () => {
		const { ball, canvasSize, user, paddle } = state;

		// If the ball hits the wall on any side of the canvas then reverse
		// direction on the x axis.
		if (ball.x + bx > canvasSize.w - ball.r || ball.x + bx < ball.r) {
			bx = -bx;
		}

		// If the ball hits the ceiling, then reverse direction on the y axis
		if (ball.y + by < ball.r) {
			by = -by;
		// If the ball hits the bottom of the canvas...
		} else if (ball.y + by > canvasSize.h - ball.r) {
			// ... and it's within the bounds of the paddle, then reverse direction
			// on the y axis
			if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
				by = -by;
			} else {
				// Otherwise you are out of luck!
				window.location.reload();
			}
		}

		// Increase ball position
		state.ball = Object.assign(state.ball, moveBall(state));

		// If the user is pressing a key then move the paddle
		if (user.keys.right && paddle.x < canvasSize.w - paddle.w) {
			state.paddle.x += px;
		} else if (user.keys.left && paddle.x > 0) {
			state.paddle.x -= px;
		}
		state.bricks = brickCollision(state);
		// console.log(state.bricks);
		return state;
	};

	// This method is designed to run inside `setInterval` to draw the game at its current state on every frame.
	return () => {
		clear();
		const next = nextFrame();
		drawBall(next.ball);
		drawPaddle(next.paddle);
		drawBricks(next.bricks);
	};
};

const generateBricks = () => {
	const ret = [];
	for (let c = 0; c < config.brick.colCount; c++) {
		ret[c] = [];
		for (let r = 0; r < config.brick.rowCount; r++) {
			const brick = Object.assign(
				{},
				getBrickPos(c, r),
				{
					w: config.brick.w,
					h: config.brick.h,
					status: 1,
				}
			);
			ret[c][r] = brick;
		}
	}
	return ret;
};


/**
 * Creates the initial state for the game based on the size of the canvas element passed in.
 *
 * @param {canvas} canvas - A canvas DOM element that denotes the boundaries of the game
 * @returns {object} - The intended initial state of the game.
 */
const initialState = canvas => ({
	bricks: generateBricks(),
	ball: {
		x: canvas.width / 2,
		y: canvas.height - 30,
		r: config.ball.radius,
	},
	paddle: {
		w: 75,
		h: 10,
		x: ((canvas.width - 75) / 2),
		y: (canvas.height - 10),
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

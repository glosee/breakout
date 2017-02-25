import config from '../config.js';

/**
 * Takes a canvas context and returns a function that takes an object of params to use
 * to draw a circle into the originally passed in context.
 *
 * @param {canvasContext} ctx - The context from a canvas DOM element
 * @returns {function} - A function that accepts an object with x, y, and radius values
 * with which to draw circle into the originally passed in context.
 */
export const drawCircle = ctx => ({ x, y, r }) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = config.colors.ball.base;
	ctx.fill();
	ctx.closePath();
};

/**
 * Takes a canvas context and returns a function that takes an object of params to use
 * to draw a rectangle into the originally passed in context.
 *
 * @param {canvasContext} ctx - The context from a canvas DOM element
 * @returns {function} - A function that accepts an object with x, y, width, and height values
 * with which to draw circle into the originally passed in context.
 */
export const drawRect = ctx => ({ x, y, w, h }) => {
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
export const clearFrame = (ctx, { w, h }) => () => {
	ctx.clearRect(0, 0, w, h);
};

export const getBrickPos = (col, row) => {
	const { brick } = config;
	return {
		x: (col * (brick.w + brick.padding)) + brick.offsetLeft,
		y: (row * (brick.h + brick.padding)) + brick.offsetTop,
	};
};

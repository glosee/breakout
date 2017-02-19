import sayHello from './modules/say-hello';

const p = document.createElement('p');
p.innerHTML = sayHello('hellloooooooouuuuuu');

let i = 5;
while (i > 0) {
	document.body.appendChild(p);
	i -= 1;
}

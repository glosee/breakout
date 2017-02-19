import './styles/main.css';
import sayHello from './modules/say-hello';

if (ENV !== 'production') {
	// Enable livereload
	const lrScript = document.createElement('script');
	lrScript.src = `http://${(location.host || 'localhost').split(':')[0]}:35729/livereload.js?snipver=1`;
	document.body.appendChild(lrScript);
}

const p = document.createElement('p');
p.innerHTML = sayHello('dfhaksjfhal');
document.body.appendChild(p);

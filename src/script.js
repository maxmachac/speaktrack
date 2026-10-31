import './style.css';
import './load.js';

const themeSwitch = document.querySelector('.theme-switch');
const themeIcon = document.querySelector('.theme-icon');
const savedTheme = window.localStorage.getItem('speaktrack-theme');

function applyTheme(mode) {
	const isDark = mode === 'dark';
	document.body.dataset.theme = mode;
	themeSwitch.checked = isDark;
	themeIcon.textContent = isDark ? '☾' : '☀';
}

applyTheme(savedTheme || 'dark');

themeSwitch.addEventListener('change', () => {
	const mode = themeSwitch.checked ? 'dark' : 'light';
	window.localStorage.setItem('speaktrack-theme', mode);
	applyTheme(mode);
});
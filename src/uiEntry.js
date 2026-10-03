import { UiDemo } from './components/UiDemo.js';
import OrderHistory from './components/OrderHistory.js';

const container = document.getElementById('app-root');

try {
 container.replaceChildren(UiDemo(), OrderHistory());
} catch (error) {
 console.error('Failed to render the canteen UI.', error);
 const message = document.createElement('p');
 message.className = 'app-error';
 message.setAttribute('role', 'alert');
 message.textContent = 'The canteen page could not be loaded. Please refresh and try again.';
 container.replaceChildren(message);
}
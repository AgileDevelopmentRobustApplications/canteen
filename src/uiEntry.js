import './theme.css';

import UiDemo from './components/UiDemo.js';
import OrderHistory from './components/OrderHistory.js';

// Append UI components to the document body
const container = document.createElement('div');
container.id = 'app-root';
document.body.appendChild(container);

// Place UI components
container.appendChild(UiDemo());

// Add a heading and the order history component
const heading = document.createElement('h2');
heading.textContent = 'Order History';
container.appendChild(heading);
container.appendChild(OrderHistory());
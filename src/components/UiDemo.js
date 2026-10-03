import { saveOrder } from '../services/orderHistory.js';

export function UiDemo() {
  const hero = document.createElement('section');
  hero.className = 'hero';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Campus canteen';

  const heading = document.createElement('h1');
  heading.textContent = 'Good food, made easy.';

  const description = document.createElement('p');
  description.textContent =
    'Your canteen dashboard is ready. Add a sample order to preview how order history works.';

  const button = document.createElement('button');
  button.className = 'primary-button';
  button.type = 'button';
  button.textContent = 'Add a sample order';
  button.addEventListener('click', () => {
    saveOrder({
      id: `ord_${Date.now()}`,
      total: 6.5,
      timestamp: new Date().toISOString(),
    });
  });

  hero.append(eyebrow, heading, description, button);
  return hero;
}

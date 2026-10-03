/**
 * Simple UI component that demonstrates theme variables.
 * Exported function UiDemo creates a DOM fragment with styled elements.
 */
export function UiDemo() {
  const container = document.createElement('div');

  // Header using primary color
  const header = document.createElement('header');
  header.textContent = 'Demo Header';
  Object.assign(header.style, {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    padding: '1rem',
    textAlign: 'center',
  });
  container.appendChild(header);

  // Button using secondary color
  const btn = document.createElement('button');
  btn.textContent = 'Click Me';
  Object.assign(btn.style, {
    backgroundColor: 'var(--color-secondary)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  });
  btn.onclick = () => alert('Button clicked');
  container.appendChild(btn);

  // Text block using text color
  const p = document.createElement('p');
  p.textContent = 'This text uses the theme\'s text color.';
  Object.assign(p.style, {
    color: 'var(--color-text)',
    fontSize: '1rem',
    marginTop: '1rem',
  });
  container.appendChild(p);

  // Element using accent color as border
  const accentDiv = document.createElement('div');
  accentDiv.textContent = 'Accent colored box';
  Object.assign(accentDiv.style, {
    border: '2px solid var(--color-accent)',
    padding: '0.5rem',
    marginTop: '1rem',
  });
  container.appendChild(accentDiv);

  return container;
}
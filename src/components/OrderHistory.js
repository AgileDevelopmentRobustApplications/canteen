import {
  clearOrders,
  deleteOrder,
  getOrders,
  subscribe,
} from '../services/orderHistory.js';

function OrderHistory() {
  const section = document.createElement('section');
  section.className = 'history-panel';
  section.setAttribute('aria-labelledby', 'order-history-heading');

  const heading = document.createElement('h2');
  heading.id = 'order-history-heading';
  heading.textContent = 'Order history';

  const count = document.createElement('span');
  count.className = 'order-count';
  count.setAttribute('aria-live', 'polite');

  const headingRow = document.createElement('div');
  headingRow.className = 'panel-heading';
  headingRow.append(heading, count);

  const content = document.createElement('div');
  const clearButton = document.createElement('button');
  clearButton.className = 'clear-button';
  clearButton.type = 'button';
  clearButton.textContent = 'Clear all';
  clearButton.addEventListener('click', () => {
    if (window.confirm('Delete all saved orders?')) {
      clearOrders();
    }
  });

  section.append(headingRow, content, clearButton);

  function render(orders) {
    count.textContent = `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`;
    clearButton.hidden = orders.length === 0;
    content.replaceChildren();

    if (orders.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No orders yet. Add a sample order to see it here.';
      content.append(emptyState);
      return;
    }

    const table = document.createElement('table');
    table.className = 'order-table';
    const head = table.createTHead();
    const headerRow = head.insertRow();
    for (const label of ['Order', 'Total', 'Date', '']) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      headerRow.append(cell);
    }

    const body = table.createTBody();
    for (const order of orders) {
      const row = body.insertRow();

      const idCell = row.insertCell();
      idCell.textContent = order.id;

      const totalCell = row.insertCell();
      totalCell.textContent = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(order.total);

      const dateCell = row.insertCell();
      const date = new Date(order.timestamp);
      dateCell.textContent = Number.isNaN(date.getTime())
        ? 'Date unavailable'
        : date.toLocaleString();

      const actionCell = row.insertCell();
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('aria-label', `Delete order ${order.id}`);
      deleteButton.addEventListener('click', () => deleteOrder(order.id));
      actionCell.append(deleteButton);
    }

    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-wrap';
    tableWrap.append(table);
    content.append(tableWrap);
  }

  render(getOrders());
  subscribe(render);
  return section;
}

export default OrderHistory;

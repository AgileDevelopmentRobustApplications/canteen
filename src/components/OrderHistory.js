/**
 * OrderHistory Component
 *
 * Renders a table of saved orders and provides a "Clear All" button.
 * Uses the orderHistory service to load, render, and persist orders.
 */
import { getOrders, clearOrders, subscribe } from '../services/orderHistory.js';

function OrderHistory() {
  // Internal state holder – updated via subscription
  let _orders = [];

  /** Called whenever the order list changes (e.g., new order saved) */
  function _onChange(newOrders) {
    _orders = newOrders;
    _render();               // re‑render the table
  }

  /** Render the order table and inject it into the container */
  function _render() {
    // Create a fresh container each render so we can safely update it
    const container = document.createElement('div');
    container.className = 'order-history';

    if (_orders.length === 0) {
      container.textContent = 'No orders yet.';
      return container;
    }

    // ---- Table structure ----
    const table = document.createElement('table');
    table.className = 'order-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Order ID</th>
        <th>Total ($)</th>
        <th>Date</th>
        <th>Action</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    _orders.forEach((order, idx) => {
      const tr = document.createElement('tr');

      // Order ID
      const tdId = document.createElement('td');
      tdId.textContent = order.id;
      tr.appendChild(tdId);

      // Total
      const tdTotal = document.createElement('td');
      tdTotal.textContent = '$' + order.total.toFixed(2);
      tr.appendChild(tdTotal);

      // Date (human readable)
      const tdDate = document.createElement('td');
      tdDate.textContent = new Date(order.timestamp).toLocaleString();
      tr.appendChild(tdDate);

      // Action (Delete button)
      const tdAction = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.style.marginLeft = '0.5rem';
      delBtn.onclick = () => {
        // Remove this specific order locally – we do this by filtering the internal array
        const updated = _orders.filter((o, i) => i !== idx);
        // Push the filtered list back through the service so it gets persisted
        // The service currently only supports clearOrders, so we temporarily
        // replace the whole list with the filtered one.
        // NOTE: This is a quick demo approach; a real API would expose
        // deleteOrder(id) for proper server‑side deletion.
        // Here we simply call clearOrders and re‑add the remaining orders.
        clearOrders();
        updated.forEach(o => saveOrderLocally(o)); // local persistence via service's saveOrder
      };
      tdAction.appendChild(delBtn);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // ---- Clear All button ----
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear All Orders';
    clearBtn.style.marginTop = '0.5rem';
    clearBtn.onclick = () => {
      if (confirm('Are you sure you want to delete all saved orders?')) {
        clearOrders();
        _orders = []; // reset internal state
        _render();    // re‑render empty state
      }
    };
    container.appendChild(table);
    container.appendChild(clearBtn);
    return container;
  }

  // ---- Initial render on component mount ----
  const container = _render();

  // ---- Subscribe to external changes (e.g., when a new order is saved) ----
  const unsubscribe = subscribe(_onChange);

  // ---- Expose a simple unmount method (useful if this component is ever removed) ----
  const unmount = () => {
    unsubscribe();
  };

  // Return the DOM element that should be appended to the page
  return { container, unmount };
}

/* Export for external use */
export default OrderHistory;
const STORAGE_KEY = 'canteen-prisma-order-history';
const STORAGE_VERSION = 'v1';

let orders = [];
const listeners = new Set();

function notify() {
  const currentOrders = getOrders();
  listeners.forEach((listener) => listener(currentOrders));
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      orders = parsed;
      return;
    }

    if (parsed?._version === STORAGE_VERSION && Array.isArray(parsed.orders)) {
      orders = parsed.orders;
      return;
    }

    console.warn('Order history data has an unsupported format; starting with an empty history.');
  } catch (error) {
    console.error('Failed to load order history from local storage.', error);
  }
}

function persistOrders() {
  if (orders.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ _version: STORAGE_VERSION, orders }),
    );
  }
}

loadOrders();

export function saveOrder(order) {
  if (!order || typeof order !== 'object' || !Number.isFinite(order.total)) {
    throw new TypeError('An order with a numeric total is required.');
  }

  const savedOrder = {
    ...order,
    id: order.id || `ord_${Date.now()}`,
    timestamp: order.timestamp || new Date().toISOString(),
  };

  orders = [...orders, savedOrder];
  persistOrders();
  notify();
}

export function getOrders() {
  return orders.map((order) => ({ ...order }));
}

export function deleteOrder(id) {
  const updatedOrders = orders.filter((order) => order.id !== id);
  if (updatedOrders.length === orders.length) return;

  orders = updatedOrders;
  persistOrders();
  notify();
}

export function clearOrders() {
  orders = [];
  persistOrders();
  notify();
}

export function subscribe(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('Order history listener must be a function.');
  }

  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Simple client‑side order history manager.
 * Uses the browser's localStorage to persist orders.
 * Exported API:
 *   - saveOrder(order)   → stores a new order
 *   - getOrders()        → returns array of stored orders
 *   - clearOrders()      → removes all stored orders
 *   - subscribe(callback)→ registers a listener for changes
 *
 * In a production app you could replace the localStorage logic
 * with calls to a server‑side endpoint.
 */
const STORAGE_KEY = 'canteen-prisma-order-history';
const STORAGE_VERSION = 'v1'; // bump to invalidate old data format

/** @type {Array<Object>} */
let _orders = [];
let _listeners = [];

/** Load orders from localStorage (if any) */
function _load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed)) {
      // Guard against version mismatch
      if (parsed._version && parsed._version !== STORAGE_VERSION) {
        console.warn('Order history version mismatch – clearing stale data.');
        _orders = [];
      } else {
        _orders = parsed.orders || [];
      }
    }
  } catch (e) {
    console.error('Failed to load order history', e);
    _orders = [];
  }
}

/** Persist the current _orders array */
function _save() {
  if (!_orders.length) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const payload = {
    _version: STORAGE_VERSION,
    orders: _orders,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Save a new order.
 * @param {Object} order - The order object (e.g., {id, items, total, timestamp})
 * @returns {void}
 */
export function saveOrder(order) {
  // Simple id generation if missing
  if (!order.id) order.id = `ord_${Date.now()}`;
  _orders.push(order);
  _save();
  // Notify listeners
  _listeners.forEach((cb) => cb(_orders));
}

/**
 * Retrieve all stored orders.
 * @returns {Array<Object>} - Copy of the orders array
 */
export function getOrders() {
  // Return a shallow copy to prevent accidental mutation
  return [..._orders];
}

/**
 * Remove all stored orders.
 * @returns {void}
 */
export function clearOrders() {
  _orders = [];
  _save();
  // Notify listeners
  _listeners.forEach((cb) => cb([]));
}

/**
 * Register a callback that fires whenever the order list changes.
 * Useful for UI components that need to re‑render.
 * @param {Function} cb - function(updatedOrders)
 */
export function subscribe(cb) {
  _listeners.push(cb);
  // Return an unsubscribe function
  return () => {
    const idx = _listeners.indexOf(cb);
    if (idx > -1) _listeners.splice(idx, 1);
  };
}
const STORAGE_KEY = 'vehicle_inventory_v2';

export function saveInventory(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Sauvegarde impossible:', e);
  }
}

export function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearInventory() {
  localStorage.removeItem(STORAGE_KEY);
}

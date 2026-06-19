const STORAGE_KEY = 'typing_test_history_v1';

export function saveResult(result) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  history.unshift(result); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 200))); // keep recent 200
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

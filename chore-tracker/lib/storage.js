// Storage adapter that mimics window.storage but talks to /api/data
// Includes debouncing for writes so rapid clicks don't hammer the server.

const pendingWrites = new Map();
const WRITE_DEBOUNCE_MS = 400;

async function flushWrite(key) {
  const value = pendingWrites.get(key);
  if (value === undefined) return;
  pendingWrites.delete(key);

  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
}

const writeTimers = new Map();

export const storage = {
  async get(key) {
    try {
      const res = await fetch(`/api/data?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized');
        return null;
      }
      const { value } = await res.json();
      if (value === null || value === undefined) return null;
      // Return shape matching window.storage: { value: stringifiedJson }
      return { value: typeof value === 'string' ? value : JSON.stringify(value) };
    } catch (err) {
      console.error(`storage.get(${key}) failed:`, err);
      return null;
    }
  },

  async set(key, valueStr) {
    // Parse if it's JSON string, otherwise store as-is
    let parsed = valueStr;
    if (typeof valueStr === 'string') {
      try { parsed = JSON.parse(valueStr); } catch { parsed = valueStr; }
    }
    pendingWrites.set(key, parsed);

    // Clear any existing timer for this key and start a new one
    if (writeTimers.has(key)) clearTimeout(writeTimers.get(key));
    const timer = setTimeout(() => flushWrite(key), WRITE_DEBOUNCE_MS);
    writeTimers.set(key, timer);

    return { value: valueStr };
  },

  async bulkLoad() {
    // Single call to load history index + all summaries
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return { historyIndex: [], summaries: {} };
      return await res.json();
    } catch (err) {
      console.error('bulkLoad failed:', err);
      return { historyIndex: [], summaries: {} };
    }
  },
};

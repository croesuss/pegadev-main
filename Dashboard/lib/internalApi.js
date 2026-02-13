const INTERNAL_API_BASE = `http://127.0.0.1:${process.env.INTERNAL_API_PORT || 4501}`;

export async function internalFetch(path, options = {}) {
  const response = await fetch(`${INTERNAL_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  return { response, data };
}

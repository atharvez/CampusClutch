const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetcher<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Ensure trailing slash on base URL and no leading slash on endpoint if needed
  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  console.log(`[API] Fetching: ${fullUrl}`);

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`Server returned error status ${response.status}: ${response.statusText}`);
    }
    throw new Error(errorData.message || 'Something went wrong');
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error(`[API] JSON Parse Error. Received content:`, text.substring(0, 100));
    throw new Error('Server returned an invalid response (not JSON). Please check if the backend is running.');
  }
}

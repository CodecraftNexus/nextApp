const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

const fetchWithRefresh = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const response = await fetch(`${API_URL}${input}`, {
    ...init,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          const newInit = {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${token}`,
            },
          };
          return fetch(`${API_URL}${input}`, newInit);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error('Refresh failed');
      }

      const { accessToken } = await refreshResponse.json();

      processQueue(null, accessToken);

     
      const retryInit = {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      return fetch(`${API_URL}${input}`, retryInit);
    } catch (err) {
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};

// ==================== Final apiClient ====================
export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetchWithRefresh(endpoint, { ...options, method: 'GET' });
    const data = await res.json();

    if (!res.ok) throw data;
    return data;
  },

  post: async <T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> => {
    const res = await fetchWithRefresh(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();

    if (!res.ok) throw data;
    return data;
  },

  put: async <T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> => {
    const res = await fetchWithRefresh(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();

    if (!res.ok) throw data;
    return data;
  },

  delete: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetchWithRefresh(endpoint, { ...options, method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) throw data;
    return data;
  },
};
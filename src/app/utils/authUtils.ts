export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getRefreshTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setRefreshTokenInLocalStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshTokenFromLocalStorage();

  if (!refreshToken) {
    console.error('Refresh token is missing.');
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, newRefreshToken } = await response.json();
    
    localStorage.setItem('jwtToken', accessToken);
    if (newRefreshToken) {
      setRefreshTokenInLocalStorage(newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response | void> => {
  let token = localStorage.getItem('jwtToken');

  if (!token) {
    console.error('No token found.');
    return;
  }

  if (isTokenExpired(token)) {
    token = await refreshToken();
    if (!token) return;
  }

  const fetchData = async (token: string) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        let token = await refreshToken();
        if (!token) return;

        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return res;
    } catch (error) {
      console.error('Error during fetch:', error);
      return;
    }
  };

  return fetchData(token);
};

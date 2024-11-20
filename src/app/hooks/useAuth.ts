import { useEffect, useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error('Invalid token format');
      return true;
    }
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      setError('Refresh token is missing');
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to refresh token');
        console.error('Failed to refresh token', data.error);
        return;
      }

      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      localStorage.setItem('jwtToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      setToken(newAccessToken);
    } catch (error) {
      setError('Error refreshing token');
      console.error('Error refreshing token:', error);
    }
  };

  const authenticate = async () => {
    try {
      const response = await fetch('/api/auth/login', { method: 'GET' });

      if (!response.ok) {
        setError('Failed to generate token');
        console.error('Failed to generate token');
        return;
      }

      const { token: newToken, refreshToken: newRefreshToken } = await response.json();

      if (newToken && newRefreshToken) {
        localStorage.setItem('jwtToken', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setToken(newToken);
      } else {
        setError('No token returned from server');
      }
    } catch (error) {
      setError('Error fetching token');
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      let currentToken = localStorage.getItem('jwtToken');

      if (!currentToken || isTokenExpired(currentToken)) {
        if (currentToken) {
          await refreshToken();
        } else {
          await authenticate();
        }
        return;
      }

      setToken(currentToken);
      setLoading(false);
    };

    getToken();

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('jwtToken');
      if (currentToken && isTokenExpired(currentToken)) {
        refreshToken();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { token, loading, error };
};

export default useAuth;

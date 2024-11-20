export const storeRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const getRefreshTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshTokenFromLocalStorage();

  if (!refreshToken) {
    console.error("Refresh token is missing.");
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

    const { accessToken } = await response.json();
    localStorage.setItem('jwtToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

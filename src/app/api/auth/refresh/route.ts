import { NextResponse } from 'next/server';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface RefreshTokenPayload extends JwtPayload {
  id: string;
  role?: string;
}

const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Unknown error during token verification');
  }
};

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
    }

    const user = verifyRefreshToken(refreshToken);

    const newAccessToken = jwt.sign({ role: user.role, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Invalid refresh token' }, { status: 403 });
  }
}

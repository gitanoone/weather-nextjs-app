import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid refresh token' }, { status: 403 });
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateRefreshToken = (user: { role: string, id: string }) => {
  return jwt.sign(user, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateAccessToken = (user: { role: string, id: string }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

export async function GET() {
  const user = { role: 'guest', id: '12345' };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return NextResponse.json({ 
    token: accessToken,
    refreshToken: refreshToken
  });
}

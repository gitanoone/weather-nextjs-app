import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData, fetchWeatherByCoordinates, fetchCitySuggestions } from '../../utils/weatherUtils';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token ' + error);
  }
};

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
  }

  const queryParams = req.nextUrl.searchParams;
  const city = queryParams.get('city');
  const latitude = queryParams.get('latitude');
  const longitude = queryParams.get('longitude');
  const query = queryParams.get('query');

  try {
    verifyJWT(token);

    if (city) {
      const data = await fetchWeatherData(city);
      return NextResponse.json(data);
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
      }

      const data = await fetchWeatherByCoordinates(lat, lon);
      return NextResponse.json(data);
    }

    if (query) {
      const data = await fetchCitySuggestions(query);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Missing required parameters. Please provide either city, latitude/longitude, or query.' }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Invalid or expired token') {
        return NextResponse.json({ error: 'Token expired or invalid, please refresh your token' }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}

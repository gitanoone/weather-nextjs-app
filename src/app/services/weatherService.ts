import { CitySearchResponse }  from "../types/weatherTypes";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function fetchWeatherData(city: string) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}

export async function fetchWeatherByCoordinates(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}

export async function fetchCitySuggestions(query: string): Promise<CitySearchResponse> {
    const response = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("Failed to fetch city suggestions");
  return response.json();
}

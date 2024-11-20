import { RawWeatherData } from "../types/weatherTypes";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export const fetchWeatherData = async (city: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const rawData: RawWeatherData = await response.json();
  return rawData;
};

export const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const rawData: RawWeatherData = await response.json();
  return rawData;
};

interface CitySuggestionsResponse {
  list: RawWeatherData[];
}

export const fetchCitySuggestions = async (query: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch city suggestions');
  }

  const rawData: CitySuggestionsResponse = await response.json();

  if (rawData.list && rawData.list.length > 0) {
    return rawData.list.map((city: RawWeatherData) => ({id: city.id,name: city.name, country: city.sys.country}));
  }

  return [];
};

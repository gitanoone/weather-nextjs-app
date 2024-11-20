// City interface
export interface City {
  id: number;
  name: string;
  country: string;
}

// Weather system information
export interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

// Main weather metrics
export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

// Wind information
export interface WeatherWind {
  speed: number;
  deg: number;
}

// Individual weather description
export interface WeatherCondition {
  description: string;
  icon: string;
}

// API-provided weather data structure
export interface WeatherData {
  main: WeatherMain;
  wind: WeatherWind;
  sys: WeatherSys;
  weather: WeatherCondition[];
}

// Processed current weather
export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface RawWeatherData {
  name: string;
  sys: WeatherSys;
  main: WeatherMain;
  wind: WeatherWind;
  weather: WeatherCondition[];
}

export interface CitySearchResponse {
  list: {
    id: number;
    name: string;
    sys: { country: string };
  }[];
}

export interface WeatherCardProps {
  data?: CurrentWeather | null;
  isLoading: boolean;
  error: string | Error | null;
}
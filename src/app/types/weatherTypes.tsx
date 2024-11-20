export interface City {
  id: number;
  name: string;
  country: string;
}

export interface CityFromAPI {
  id: number;
  name: string;
  country: string;
}

export interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
}

export interface WeatherCondition {
  description: string;
  icon: string;
}

export interface WeatherData {
  main: WeatherMain;
  wind: WeatherWind;
  sys: WeatherSys;
  weather: WeatherCondition[];
}

export interface CurrentWeather {
  name: string;
  country: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface RawWeatherData {
  id: number;
  name: string;
  sys: WeatherSys;
  main: WeatherMain;
  wind: WeatherWind;
  weather: WeatherCondition[];
}

export interface WeatherCardProps {
  data?: CurrentWeather | null;
  isLoadingWeather: boolean;
  error: string | Error | null;
}
